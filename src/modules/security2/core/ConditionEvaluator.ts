/**
 * Copyright (c) 2025 Cato Hansen. All rights reserved.
 * 
 * Proprietary - Unauthorized copying, modification, distribution, or use
 * of this software, via any medium is strictly prohibited without express
 * written permission from Cato Hansen.
 * 
 * @license PROPRIETARY
 * SPDX-License-Identifier: PROPRIETARY
 * @author Cato Hansen
 * @contact cato@catohansen.no
 * @website www.catohansen.no
 */

/**
 * Condition Evaluator (CEL-like)
 * Evaluates conditions in policy rules
 * 
 * Features:
 * - CEL-like expression evaluation
 * - Support for: ==, !=, >, <, >=, <=, &&, ||, in, startsWith, endsWith
 * - Path lookup in principal and resource
 * - Safe evaluation (sandboxed)
 */

export interface Condition {
  expression?: string // e.g. "principal.department == resource.department"
  left?: string // Path in request (e.g. "principal.attributes.department")
  op?: string // Operator (e.g. "eq", "neq", "in", "gte")
  right?: any // Value to compare against
}

export interface ConditionContext {
  principal: Record<string, unknown>
  resource: Record<string, unknown>
  context?: Record<string, unknown>
}

export class ConditionEvaluator {
  /**
   * Evaluate condition object (with left, op, right)
   * This is the format from the new skeleton
   */
  match(rule: {
    resource?: string
    action?: string
    roles?: string[]
    when?: Condition[]
    conditions?: Record<string, any> | string
  }, req: {
    principal: { roles: string[]; id: string; attributes?: Record<string, unknown> }
    resource: { type: string; id?: string; attributes?: Record<string, unknown> }
    action: string
    context?: Record<string, unknown>
  }): boolean {
    // Check resource match
    if (rule.resource && rule.resource !== req.resource.type) {
      return false
    }

    // Check action match
    if (rule.action && rule.action !== req.action && rule.action !== '*') {
      return false
    }

    // Check roles
    if (rule.roles && rule.roles.length > 0) {
      const roleMatch = rule.roles.some(r => req.principal.roles.includes(r))
      if (!roleMatch) {
        return false
      }
    }

    // Evaluate "when" conditions (array of conditions)
    if (rule.when && Array.isArray(rule.when)) {
      for (const cond of rule.when) {
        if (!this.evaluateCondition(cond, {
          principal: { ...req.principal.attributes, id: req.principal.id, roles: req.principal.roles },
          resource: { ...req.resource.attributes, id: req.resource.id, type: req.resource.type },
          context: req.context
        })) {
          return false
        }
      }
    }

    // Evaluate legacy conditions (string or object)
    if (rule.conditions) {
      if (typeof rule.conditions === 'string') {
        return this.evaluate(rule.conditions, req.principal.attributes || {}, req.resource.attributes || {})
      } else if (typeof rule.conditions === 'object') {
        // Object conditions - evaluate each
        for (const [key, value] of Object.entries(rule.conditions)) {
          if (!this.evaluateCondition({ left: key, op: 'eq', right: value }, {
            principal: req.principal.attributes || {},
            resource: req.resource.attributes || {},
            context: req.context
          })) {
            return false
          }
        }
      }
    }

    return true
  }

  /**
   * Evaluate condition object
   */
  evaluateCondition(cond: Condition, ctx: ConditionContext): boolean {
    if (!cond.left || !cond.op) {
      // Fall back to expression evaluation
      if (cond.expression) {
        return this.evaluate(cond.expression, ctx.principal, ctx.resource)
      }
      return true // No condition = always true
    }

    const left = this.lookup(ctx, cond.left)
    const right = cond.right

    return this.compare(left, right, cond.op)
  }

  /**
   * Evaluate condition expression against principal and resource
   */
  evaluate(
    expression: string,
    principal: Record<string, unknown>,
    resource: Record<string, unknown>
  ): boolean {
    try {
      // Replace variable references
      let evalExpr = expression
      
      // Replace principal.attr references
      evalExpr = evalExpr.replace(
        /principal\.([a-zA-Z_][a-zA-Z0-9_.]*)/g,
        (match, attr) => {
          const value = this.getNestedValue(principal, attr)
          return JSON.stringify(value)
        }
      )
      
      // Replace resource.attr references
      evalExpr = evalExpr.replace(
        /resource\.([a-zA-Z_][a-zA-Z0-9_.]*)/g,
        (match, attr) => {
          const value = this.getNestedValue(resource, attr)
          return JSON.stringify(value)
        }
      )
      
      // Handle operators
      evalExpr = evalExpr.replace(/==/g, '===')
      evalExpr = evalExpr.replace(/!=/g, '!==')
      
      // Evaluate safely
      return this.safeEvaluate(evalExpr)
    } catch (error) {
      console.error('Condition evaluation error:', error)
      return false // Fail secure
    }
  }

  /**
   * Lookup value in context using path
   */
  private lookup(ctx: ConditionContext, path: string): unknown {
    const parts = path.split('.')
    let current: any = ctx

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part]
      } else {
        return undefined
      }
    }

    return current
  }

  /**
   * Compare values with operator
   */
  private compare(left: unknown, right: unknown, op: string): boolean {
    switch (op) {
      case 'eq':
      case '==':
        return left === right
      
      case 'neq':
      case '!=':
        return left !== right
      
      case 'in':
        if (Array.isArray(right)) {
          return right.includes(left)
        }
        return false
      
      case 'gte':
      case '>=':
        return Number(left) >= Number(right)
      
      case 'lte':
      case '<=':
        return Number(left) <= Number(right)
      
      case 'gt':
      case '>':
        return Number(left) > Number(right)
      
      case 'lt':
      case '<':
        return Number(left) < Number(right)
      
      case 'match':
      case 'regex':
        if (typeof left === 'string' && typeof right === 'string') {
          try {
            return new RegExp(right).test(left)
          } catch {
            return false
          }
        }
        return false
      
      case 'startsWith':
        if (typeof left === 'string' && typeof right === 'string') {
          return left.startsWith(right)
        }
        return false
      
      case 'endsWith':
        if (typeof left === 'string' && typeof right === 'string') {
          return left.endsWith(right)
        }
        return false
      
      default:
        console.warn(`Unknown operator: ${op}`)
        return false
    }
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    const keys = path.split('.')
    let value: unknown = obj
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key]
      } else {
        return undefined
      }
    }
    
    return value
  }

  /**
   * Safe expression evaluation using expr-eval library
   */
  private safeEvaluate(expr: string): boolean {
    try {
      // Import expr-eval dynamically
      const { Parser } = require('expr-eval')
      const parser = new Parser()
      const exp = parser.parse(expr)
      const result = exp.evaluate({})
      return Boolean(result)
    } catch (error) {
      // Fallback to basic evaluation
      try {
        // Basic validation
        if (!/^[0-9\s"'.===!<>()&|]+$/.test(expr.replace(/principal|resource/g, ''))) {
          return false
        }
        const result = new Function(`return ${expr}`)()
        return Boolean(result)
      } catch {
        return false
      }
    }
  }

  /**
   * Validate condition expression syntax
   */
  validate(expression: string): { valid: boolean; error?: string } {
    try {
      // Basic syntax validation
      if (!expression || expression.trim().length === 0) {
        return { valid: false, error: 'Empty expression' }
      }

      // Check for valid operators
      const operators = ['==', '!=', '>', '<', '>=', '<=', '&&', '||', 'in']
      const hasOperator = operators.some(op => expression.includes(op))
      
      if (!hasOperator) {
        return { valid: false, error: 'No valid operator found' }
      }

      return { valid: true }
    } catch (error) {
      return { valid: false, error: String(error) }
    }
  }
}

// Default condition evaluator instance
export const conditionEvaluator = new ConditionEvaluator()

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
 * Error Helper Engine
 * Generates contextual error help with suggestions, examples, and auto-fix
 * 
 * Features:
 * - Context-aware error suggestions
 * - Auto-fix detection and generation
 * - Example generation (wrong vs correct)
 * - Step-by-step instructions
 * - Related documentation links
 */

import { ErrorHelp } from '../components/InteractiveError'

export interface ValidationError {
  field: string
  message: string
  code: string
  value?: string
  expected?: string
}

/**
 * Error Helper
 * Generates helpful error information based on error code and context
 */
export class ErrorHelper {
  /**
   * Generate error help from validation error
   */
  generateErrorHelp(
    error: ValidationError,
    context?: Record<string, any>
  ): ErrorHelp {
    const helper = this.getErrorHelper(error.code)
    return helper(error, context)
  }

  /**
   * Get error helper function for specific error code
   */
  private getErrorHelper(code: string): (
    error: ValidationError,
    context?: Record<string, any>
  ) => ErrorHelp {
    const helpers: Record<
      string,
      (error: ValidationError, context?: Record<string, any>) => ErrorHelp
    > = {
      INVALID_ID_FORMAT: this.handleInvalidIdFormat,
      DUPLICATE_MODULE: this.handleDuplicateModule,
      INVALID_VERSION: this.handleInvalidVersion,
      INVALID_URL_FORMAT: this.handleInvalidUrlFormat,
      REPO_NOT_FOUND: this.handleRepoNotFound,
      GITHUB_API_ERROR: this.handleGitHubApiError,
      MISSING_REQUIRED_FIELD: this.handleMissingField,
      MISSING_ID: this.handleMissingId,
      INVALID_GITHUB_REPO: this.handleInvalidGitHubRepo,
    }

    return helpers[code] || this.handleGenericError
  }

  private handleInvalidIdFormat = (
    error: ValidationError
  ): ErrorHelp => ({
    title: 'Ugyldig modulnavn',
    message:
      error.message ||
      'Modulnavnet må være lowercase, alfanumerisk med bindestrek',
    code: error.code,
    field: error.field,
    severity: 'error',
    suggestions: [
      'Bruk kun små bokstaver (a-z)',
      'Bruk tall (0-9) hvis nødvendig',
      'Bruk bindestrek (-) for å separere ord',
      'Unngå mellomrom, understrek eller spesialtegn',
    ],
    examples: [
      {
        wrong: 'My Awesome Module',
        correct: 'my-awesome-module',
        explanation: 'Modulnavn skal være lowercase med bindestrek',
      },
      {
        wrong: 'my_awesome_module',
        correct: 'my-awesome-module',
        explanation: 'Bruk bindestrek (-) i stedet for understrek (_)',
      },
      {
        wrong: 'myAwesomeModule',
        correct: 'my-awesome-module',
        explanation: 'Separer ord med bindestrek, ikke camelCase',
      },
    ],
    links: [
      {
        label: 'Modulnavn regler',
        url: '/docs/guides/module-naming',
      },
    ],
  })

  private handleDuplicateModule = (
    error: ValidationError
  ): ErrorHelp => ({
    title: 'Modulnavn eksisterer allerede',
    message:
      error.message ||
      'Et modul med dette navnet er allerede registrert i systemet',
    code: error.code,
    field: error.field,
    severity: 'error',
    suggestions: [
      'Velg et annet navn for modulen',
      'Sjekk om du kan bruke en eksisterende modul',
      'Vurder å oppdatere eksisterende modul i stedet',
    ],
    examples: [
      {
        wrong: 'hansen-security',
        correct: 'hansen-security-v2',
        explanation:
          'Hvis du lager en ny versjon, legg til versjonsnummer i navnet',
      },
      {
        wrong: 'user-management',
        correct: 'user-management-custom',
        explanation: 'Legg til et unikt suffix for å skille det',
      },
    ],
    links: [
      {
        label: 'Se eksisterende moduler',
        url: '/admin/modules',
      },
    ],
  })

  private handleInvalidVersion = (error: ValidationError): ErrorHelp => ({
    title: 'Ugyldig versjonsnummer',
    message:
      error.message ||
      'Versjonsnummeret må følge semantisk versjonering (SemVer)',
    code: error.code,
    field: error.field,
    severity: 'error',
    suggestions: [
      'Bruk formatet X.Y.Z (f.eks. 1.0.0)',
      'Major versjon (X) for breaking changes',
      'Minor versjon (Y) for nye features',
      'Patch versjon (Z) for bug fixes',
    ],
    examples: [
      {
        wrong: '1.0',
        correct: '1.0.0',
        explanation: 'Versjon må ha tre deler: major.minor.patch',
      },
      {
        wrong: 'v1.0.0',
        correct: '1.0.0',
        explanation: 'Ikke inkluder "v" prefix',
      },
      {
        wrong: '1.0.0-alpha',
        correct: '1.0.0-alpha.1',
        explanation:
          'Pre-release versions bør ha build number (1.0.0-alpha.1)',
      },
    ],
    steps: [
      'Start med versjon 1.0.0 for ny modul',
      'Øk patch (1.0.1) for bug fixes',
      'Øk minor (1.1.0) for nye features',
      'Øk major (2.0.0) for breaking changes',
    ],
    links: [
      {
        label: 'Semantic Versioning Guide',
        url: 'https://semver.org/',
      },
    ],
  })

  private handleInvalidUrlFormat = (error: ValidationError): ErrorHelp => ({
    title: 'Ugyldig GitHub URL format',
    message:
      error.message ||
      'GitHub URL-en må følge formatet: https://github.com/owner/repo',
    code: error.code,
    field: error.field,
    severity: 'error',
    suggestions: [
      'Sørg for at URL-en starter med https://github.com/',
      'Inkluder både owner og repo navn',
      'Fjern .git extension hvis den er der',
      'Ikke inkluder branch eller path',
    ],
    examples: [
      {
        wrong: 'github.com/owner/repo',
        correct: 'https://github.com/owner/repo',
        explanation: 'URL må ha https:// prefix',
      },
      {
        wrong: 'https://github.com/owner',
        correct: 'https://github.com/owner/repo',
        explanation: 'URL må inkludere både owner og repo navn',
      },
      {
        wrong: 'https://github.com/owner/repo.git',
        correct: 'https://github.com/owner/repo',
        explanation: 'Fjern .git extension',
      },
      {
        wrong: 'https://github.com/owner/repo/tree/main',
        correct: 'https://github.com/owner/repo',
        explanation: 'Ikke inkluder branch eller path i URL',
      },
    ],
    steps: [
      'Åpne GitHub repository i nettleseren',
      'Kopier URL-en fra adressefeltet',
      'Fjern eventuell .git extension',
      'Fjern eventuell branch eller path',
    ],
    links: [
      {
        label: 'GitHub Repository Guide',
        url: 'https://docs.github.com/en/repositories',
      },
    ],
  })

  private handleRepoNotFound = (error: ValidationError): ErrorHelp => ({
    title: 'GitHub repository ikke funnet',
    message:
      error.message ||
      'Repository eksisterer ikke eller er ikke tilgjengelig',
    code: error.code,
    field: error.field,
    severity: 'error',
    suggestions: [
      'Verifiser at repository navnet er korrekt',
      'Sjekk at repository er offentlig eller at du har tilgang',
      'Hvis repository er privat, konfigurer GITHUB_TOKEN',
      'Verifiser at owner/repo navn er riktig',
    ],
    steps: [
      'Sjekk at repository URL-en er korrekt',
      'Prøv å åpne URL-en i nettleseren',
      'Hvis repository er privat, legg til GITHUB_TOKEN i .env',
      'Verifiser at du har tilgang til repository',
    ],
    links: [
      {
        label: 'GitHub Token Setup',
        url: '/docs/guides/github-setup',
      },
    ],
  })

  private handleGitHubApiError = (
    error: ValidationError
  ): ErrorHelp => ({
    title: 'GitHub API feil',
    message:
      error.message ||
      'Kunne ikke hente data fra GitHub API. Dette kan være pga rate limiting eller manglende token.',
    code: error.code,
    field: error.field,
    severity: 'warning',
    suggestions: [
      'Vent noen minutter og prøv igjen (rate limiting)',
      'Konfigurer GITHUB_TOKEN i .env fil',
      'Sjekk at token har riktige permissions',
    ],
    steps: [
      'Legg til GITHUB_TOKEN i .env fil',
      'Token kan genereres på https://github.com/settings/tokens',
      'Token trenger "repo" scope for private repositories',
      'Restart server etter å ha lagt til token',
    ],
    links: [
      {
        label: 'GitHub Personal Access Tokens',
        url: 'https://github.com/settings/tokens',
      },
    ],
  })

  private handleMissingField = (error: ValidationError): ErrorHelp => ({
    title: 'Manglende påkrevd felt',
    message: error.message || `Feltet "${error.field}" er påkrevd`,
    code: error.code,
    field: error.field,
    severity: 'error',
    suggestions: [
      `Fyll ut feltet "${error.field}"`,
      'Alle påkrevde felt må være utfylt før du kan fortsette',
    ],
  })

  private handleMissingId = (error: ValidationError): ErrorHelp => ({
    title: 'Modul ID mangler',
    message:
      error.message ||
      'Modul ID eller navn er påkrevd for å registrere en modul',
    code: error.code,
    field: error.field,
    severity: 'error',
    suggestions: [
      'Legg inn et unikt modulnavn',
      'Navnet brukes for å identifisere modulen i systemet',
      'Navnet kan ikke endres etter registrering',
    ],
    examples: [
      {
        wrong: '',
        correct: 'my-awesome-module',
        explanation: 'Modulnavn er påkrevd',
      },
    ],
  })

  private handleInvalidGitHubRepo = (
    error: ValidationError
  ): ErrorHelp => ({
    title: 'Ugyldig GitHub repository',
    message: error.message || 'Kunne ikke validere GitHub repository',
    code: error.code,
    field: error.field,
    severity: 'error',
    suggestions: [
      'Sjekk at URL-en er korrekt formatert',
      'Verifiser at repository eksisterer',
      'Sjekk tilgang til repository',
    ],
  })

  private handleGenericError = (error: ValidationError): ErrorHelp => ({
    title: 'Valideringsfeil',
    message: error.message || 'Det oppstod en valideringsfeil',
    code: error.code,
    field: error.field,
    severity: 'error',
    suggestions: [
      'Sjekk at alle felt er korrekt utfylt',
      'Verifiser formatet på input',
      'Les feilmeldingen nøye',
    ],
  })

  /**
   * Check if error can be auto-fixed
   */
  canAutoFix(error: ValidationError): boolean {
    const autoFixableCodes = [
      'INVALID_ID_FORMAT',
      'INVALID_VERSION',
      'INVALID_URL_FORMAT',
    ]
    return autoFixableCodes.includes(error.code)
  }

  /**
   * Generate auto-fix action
   */
  generateAutoFix(error: ValidationError): (value: string) => string {
    switch (error.code) {
      case 'INVALID_ID_FORMAT':
        return (value: string) => {
          return value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
        }
      case 'INVALID_VERSION':
        return (value: string) => {
          // Remove 'v' prefix and normalize
          let normalized = value.replace(/^v/i, '')
          // Ensure 3 parts
          const parts = normalized.split('.')
          if (parts.length === 1) {
            return `${parts[0]}.0.0`
          }
          if (parts.length === 2) {
            return `${parts[0]}.${parts[1]}.0`
          }
          return normalized
        }
      case 'INVALID_URL_FORMAT':
        return (value: string) => {
          let fixed = value.trim()
          // Add https:// if missing
          if (!fixed.startsWith('http')) {
            fixed = `https://${fixed}`
          }
          // Remove .git
          fixed = fixed.replace(/\.git$/, '')
          // Remove branch/path
          fixed = fixed.replace(/\/tree\/.*$/, '')
          fixed = fixed.replace(/\/blob\/.*$/, '')
          return fixed
        }
      default:
        return (value: string) => value
    }
  }
}

/**
 * Create error helper instance
 */
export function createErrorHelper() {
  return new ErrorHelper()
}

/**
 * Default error helper instance
 */
export const errorHelper = new ErrorHelper()






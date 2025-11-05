-- Copyright (c) 2025 Cato Hansen. All rights reserved.
-- 
-- Proprietary - Unauthorized copying, modification, distribution, or use
-- of this software, via any medium is strictly prohibited without express
-- written permission from Cato Hansen.
-- 
-- @license PROPRIETARY
-- SPDX-License-Identifier: PROPRIETARY
-- @author Cato Hansen
-- @contact cato@catohansen.no
-- @website www.catohansen.no

-- Advanced RBAC Seed Data
-- This file seeds the database with default roles and permissions

-- Insert default permissions
INSERT INTO permissions (id, name, resource, action, description, category, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'project.create', 'project', 'CREATE', 'Create new projects', 'content', NOW(), NOW()),
  (gen_random_uuid(), 'project.read', 'project', 'READ', 'View projects', 'content', NOW(), NOW()),
  (gen_random_uuid(), 'project.update', 'project', 'UPDATE', 'Edit projects', 'content', NOW(), NOW()),
  (gen_random_uuid(), 'project.delete', 'project', 'DELETE', 'Delete projects', 'content', NOW(), NOW()),
  (gen_random_uuid(), 'project.publish', 'project', 'PUBLISH', 'Publish projects', 'content', NOW(), NOW()),
  (gen_random_uuid(), 'user.create', 'user', 'CREATE', 'Create new users', 'users', NOW(), NOW()),
  (gen_random_uuid(), 'user.read', 'user', 'READ', 'View users', 'users', NOW(), NOW()),
  (gen_random_uuid(), 'user.update', 'user', 'UPDATE', 'Edit users', 'users', NOW(), NOW()),
  (gen_random_uuid(), 'user.delete', 'user', 'DELETE', 'Delete users', 'users', NOW(), NOW()),
  (gen_random_uuid(), 'user.manage', 'user', 'MANAGE', 'Manage user settings', 'users', NOW(), NOW()),
  (gen_random_uuid(), 'admin.access', 'admin', 'ADMINISTER', 'Access admin panel', 'admin', NOW(), NOW()),
  (gen_random_uuid(), 'role.create', 'role', 'CREATE', 'Create roles', 'admin', NOW(), NOW()),
  (gen_random_uuid(), 'role.update', 'role', 'UPDATE', 'Edit roles', 'admin', NOW(), NOW()),
  (gen_random_uuid(), 'role.delete', 'role', 'DELETE', 'Delete roles', 'admin', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Note: Roles will be created via application code or additional migrations
-- This ensures proper integration with the application logic








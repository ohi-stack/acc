import fs from 'fs';
import path from 'path';
import { getDatabase } from './postgres';
import { logger } from '../utils/logger';

export async function runMigrations(): Promise<void> {
  const db = await getDatabase();
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');

  logger.info('Running database migrations from schema.sql');
  
  // Split statements and execute
  const statements = sql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    try {
      await db.query(statement);
    } catch (err: any) {
      logger.error({ err: err.message, statement: statement.slice(0, 80) }, 'Migration statement error');
      throw err;
    }
  }

  logger.info('Database tables verified. Seeding initial baseline data...');
  await seedInitialData(db);
  logger.info('Database migrations and seeds completed successfully');
}

async function seedInitialData(db: any): Promise<void> {
  // Seed Users
  await db.query(`
    INSERT INTO users (id, username, name, email, role)
    VALUES
      ('usr-admin-01', 'onegodian_admin', 'Chief Platform Operator', 'admin@onegodian.com', 'super_admin'),
      ('usr-lead-01', 'domain_lead_01', 'Autonomous Systems Lead', 'lead@onegodian.com', 'domain_lead'),
      ('usr-op-01', 'acc_operator_01', 'Site Reliability Operator', 'ops@onegodian.com', 'acc_operator'),
      ('usr-obs-01', 'sec_observer_01', 'Audit & Compliance Observer', 'audit@onegodian.com', 'observer')
    ON CONFLICT (id) DO NOTHING;
  `);

  // Seed Default ACC Agents
  await db.query(`
    INSERT INTO agents (id, name, type, version, status, capabilities, supported_task_types, environment, max_concurrency, queue_affinity, authority_role, model_adapter)
    VALUES
      (
        'agent-sec-guard-01',
        'Security & Policy Sentinel',
        'PolicyEnforcer',
        '1.2.0',
        'READY',
        '["policy_verification", "vulnerability_scan", "secret_detection"]'::jsonb,
        '["security_audit", "pr_security_scan", "policy_eval"]'::jsonb,
        'production',
        4,
        'acc-tasks',
        'agent_executor',
        'gemini-3.8-flash'
      ),
      (
        'agent-eng-pr-01',
        'Engineering Council Reviewer',
        'CouncilReviewer',
        '2.0.1',
        'READY',
        '["ast_diff_review", "test_coverage_eval", "architecture_compliance"]'::jsonb,
        '["code_review", "pr_assessment", "refactor_plan"]'::jsonb,
        'production',
        2,
        'acc-tasks',
        'agent_executor',
        'gemini-3.1-pro-preview'
      ),
      (
        'agent-ci-verifier-01',
        'Build & Verification Agent',
        'CIAutomation',
        '1.0.4',
        'READY',
        '["type_compilation", "smoke_test", "evidence_generation"]'::jsonb,
        '["ci_build", "smoke_test", "container_check"]'::jsonb,
        'production',
        3,
        'acc-tasks',
        'agent_executor',
        'gemini-3.8-flash'
      ),
      (
        'agent-omos-auditor-01',
        'OMOS Operational Integrity Agent',
        'OperatingModelAuditor',
        '1.1.0',
        'READY',
        '["governance_hash_check", "audit_provenance_verification"]'::jsonb,
        '["omos_audit", "compliance_attestation"]'::jsonb,
        'production',
        2,
        'acc-tasks',
        'agent_executor',
        'gemini-3.8-flash'
      ),
      (
        'agent-exec-gateway-01',
        'General Task Orchestrator',
        'TaskOrchestrator',
        '1.5.0',
        'READY',
        '["task_decomposition", "model_dispatch", "result_synthesis"]'::jsonb,
        '["objective_plan", "task_execution", "general_command"]'::jsonb,
        'production',
        5,
        'acc-tasks',
        'agent_executor',
        'gemini-3.8-flash'
      )
    ON CONFLICT (id) DO NOTHING;
  `);

  // Seed Providers
  await db.query(`
    INSERT INTO providers (id, provider, model, capabilities, availability, health, auth_state, tool_support, structured_output, latency_ms)
    VALUES
      ('prov-gemini-flash', 'google', 'gemini-3.8-flash', '["text_generation", "tool_use", "structured_json", "fast_inference"]'::jsonb, 'AVAILABLE', 'Healthy', 'AUTHENTICATED', true, true, 185),
      ('prov-gemini-pro', 'google', 'gemini-3.1-pro-preview', '["complex_reasoning", "coding", "architectural_analysis"]'::jsonb, 'AVAILABLE', 'Healthy', 'AUTHENTICATED', true, true, 340),
      ('prov-openai-4o', 'openai', 'gpt-4o', '["vision", "tool_use", "code_generation"]'::jsonb, 'AVAILABLE', 'Healthy', 'AUTHENTICATED', true, true, 260),
      ('prov-anthropic-sonnet', 'anthropic', 'claude-3-5-sonnet', '["system_design", "agentic_workflows"]'::jsonb, 'AVAILABLE', 'Healthy', 'AUTHENTICATED', true, true, 310),
      ('prov-xai-grok', 'xai', 'grok-2', '["live_synthesis", "broad_knowledge"]'::jsonb, 'AVAILABLE', 'Healthy', 'AUTHENTICATED', true, true, 290),
      ('prov-ollm-llama', 'ollm', 'llama-3.3-70b-instruct', '["local_private_inference", "offline_failover"]'::jsonb, 'AVAILABLE', 'Healthy', 'AUTHENTICATED', false, true, 420)
    ON CONFLICT (id) DO NOTHING;
  `);

  // Seed Connections
  await db.query(`
    INSERT INTO connections (id, name, platform, adapter, connection_class, protocol, auth_method, capabilities, read_permissions, write_permissions, requires_human_approval, environment, health, version, rate_limits, audit_policy, verification_policy)
    VALUES
      ('conn-gh-01', 'GitHub Organization Repo Sync', 'GitHub', 'github-actions-adapter', 'Action Connections', 'HTTPS/REST', 'App Private Key', '["pr_read", "pr_review", "commit_status", "merge"]'::jsonb, '["repos", "pull_requests", "workflows"]'::jsonb, '["pull_request_comments", "check_runs"]'::jsonb, true, 'production', 'Healthy', '2.4.0', '5000 req/hr', 'AUDIT_APPEND_ONLY', 'QRV_MERGED_SHA_REQUIRED'),
      ('conn-omos-01', 'OMOS Operational Subsystem', 'OMOS', 'omos-control-plane', 'Environment Connections', 'gRPC/HTTPS', 'mTLS + JWT', '["governance_sync", "policy_download", "metric_stream"]'::jsonb, '["policies", "system_state"]'::jsonb, '["incident_reports", "compliance_records"]'::jsonb, false, 'production', 'Healthy', '1.0.8', 'Unlimited (Internal VPC)', 'STRICT_HASH_CHAIN', 'OMOS_ATTESTATION_V1'),
      ('conn-gemini-01', 'Google Gemini AI Gateway', 'Google', 'gemini-genai-adapter', 'Model Connections', 'HTTPS', 'Bearer API Key', '["text_gen", "multimodal", "function_calling"]'::jsonb, '["models", "quota"]'::jsonb, '["generate_content"]'::jsonb, false, 'production', 'Healthy', '3.0.0', '1000 RPM / 4M TPM', 'PAYLOAD_HASH_LOGGING', 'STOCHASTIC_VERIFICATION'),
      ('conn-openai-01', 'OpenAI API Bridge', 'OpenAI', 'openai-adapter', 'Model Connections', 'HTTPS', 'Bearer API Key', '["chat_completions", "embeddings"]'::jsonb, '["models"]'::jsonb, '["completions"]'::jsonb, false, 'production', 'Healthy', '1.2.0', '500 RPM', 'PAYLOAD_HASH_LOGGING', 'STANDARD_VERIFICATION'),
      ('conn-anthropic-01', 'Anthropic Claude Platform', 'Anthropic', 'anthropic-adapter', 'Model Connections', 'HTTPS', 'X-Api-Key', '["claude_messages", "tools"]'::jsonb, '["models"]'::jsonb, '["messages"]'::jsonb, false, 'production', 'Healthy', '1.1.2', '400 RPM', 'PAYLOAD_HASH_LOGGING', 'STANDARD_VERIFICATION'),
      ('conn-xai-01', 'xAI Grok Integration', 'xAI', 'xai-grok-adapter', 'Model Connections', 'HTTPS', 'Bearer Token', '["grok_inference"]'::jsonb, '["models"]'::jsonb, '["completions"]'::jsonb, false, 'production', 'Healthy', '1.0.0', '300 RPM', 'PAYLOAD_HASH_LOGGING', 'STANDARD_VERIFICATION'),
      ('conn-pg-01', 'Durable Operational PostgreSQL', 'PostgreSQL', 'pg-pool-adapter', 'Data Connections', 'TCP/PostgreSQL', 'Scram-SHA-256', '["durable_transactions", "audit_persistence", "jsonb_queries"]'::jsonb, '["all_tables"]'::jsonb, '["all_tables"]'::jsonb, false, 'production', 'Healthy', '16.2', '100 connections max', 'WAL_CONTINUOUS_ARCHIVE', 'LOCAL_STORAGE_PROHIBITED'),
      ('conn-qrv-01', 'QR-V Verification Engine', 'QR-V', 'qrv-verification-engine', 'Action Connections', 'HTTPS/mTLS', 'Service Certificate', '["cryptographic_hash_proof", "runtime_attestation", "reproducible_build"]'::jsonb, '["specs", "binaries"]'::jsonb, '["verification_records"]'::jsonb, true, 'production', 'Healthy', '2.1.0', '120 verifications/min', 'STRICT_IMMUTABLE', 'CHAIN_OF_CUSTODY_V2'),
      ('conn-obp1-01', 'OBP-1 Blueprint Protocol', 'OBP-1', 'obp1-blueprint-adapter', 'Environment Connections', 'HTTPS', 'Bearer Token', '["architecture_schemas", "canonical_rules"]'::jsonb, '["schemas", "blueprints"]'::jsonb, '["blueprint_revisions"]'::jsonb, false, 'production', 'Healthy', '1.3.1', '2000 req/hr', 'CHANGE_AUDIT', 'SCHEMA_COMPLIANCE'),
      ('conn-wp-01', 'WordPress OneGodian Portal', 'WordPress', 'wp-headless-api', 'Action Connections', 'REST', 'Application Password', '["post_publish", "media_sync"]'::jsonb, '["posts", "pages"]'::jsonb, '["posts"]'::jsonb, true, 'staging', 'Degraded', '6.5.2', '100 req/min', 'CONTENT_AUDIT', 'EDITORIAL_APPROVAL')
    ON CONFLICT (id) DO NOTHING;
  `);

  // Seed Baseline Workflows
  await db.query(`
    INSERT INTO workflows (id, name, description, status, steps)
    VALUES
      (
        'wf-eng-council-01',
        'Engineering Council Governed PR Review & Merge',
        'Governed SDLC: PR submission -> Static scan -> Cross-agent Council -> OMOS attestation -> Human merge authorization -> Deployment verification',
        'active',
        '[
          {"step": 1, "name": "PR Diff & AST Classification", "agentId": "agent-eng-pr-01", "taskType": "code_review", "requiresApproval": false},
          {"step": 2, "name": "Security & Secret Leak Scan", "agentId": "agent-sec-guard-01", "taskType": "security_audit", "requiresApproval": false},
          {"step": 3, "name": "Build & Automated Smoke Tests", "agentId": "agent-ci-verifier-01", "taskType": "ci_build", "requiresApproval": false},
          {"step": 4, "name": "OMOS Governance Attestation", "agentId": "agent-omos-auditor-01", "taskType": "omos_audit", "requiresApproval": false},
          {"step": 5, "name": "Operator Authorization to Merge", "agentId": "agent-exec-gateway-01", "taskType": "merge_gate", "requiresApproval": true},
          {"step": 6, "name": "Production Deployment & Proof Record", "agentId": "agent-ci-verifier-01", "taskType": "deploy_verify", "requiresApproval": false}
        ]'::jsonb
      ),
      (
        'wf-sec-scan-01',
        'Security Sentinel Deep Policy Audit',
        'Full vulnerability analysis, role privilege boundary check, and container configuration auditing',
        'active',
        '[
          {"step": 1, "name": "Inventory Dependent Services", "agentId": "agent-sec-guard-01", "taskType": "service_audit", "requiresApproval": false},
          {"step": 2, "name": "Evaluate Authority Boundaries", "agentId": "agent-sec-guard-01", "taskType": "policy_eval", "requiresApproval": false},
          {"step": 3, "name": "Issue Security Hardening Report", "agentId": "agent-sec-guard-01", "taskType": "report_generation", "requiresApproval": false}
        ]'::jsonb
      )
    ON CONFLICT (id) DO NOTHING;
  `);

  // Seed initial Deployments
  await db.query(`
    INSERT INTO deployments (id, repository, branch, pr_number, merged_sha, deployed_sha, environment, health_check_status, smoke_tests_status, maturity, rollback_target, verification_evidence)
    VALUES
      (
        'dep-prod-2026-001',
        'ohi-stack/acc',
        'main',
        42,
        'e6a2b8471c9df038c11e74a621f879d03829031c',
        'e6a2b8471c9df038c11e74a621f879d03829031c',
        'production',
        'Healthy',
        'Passed',
        'Functional',
        'd7c1a938210fe8b2298c412910fa789c09182390',
        '{"qrvSignature": "qrv:sha256:7b91c8...verified", "ciBuildId": "build-4921", "passedSmokeTests": ["endpoint_health", "db_durability", "agent_handshake"]}'::jsonb
      )
    ON CONFLICT (id) DO NOTHING;
  `);

  // Seed sample Pending Approval
  await db.query(`
    INSERT INTO approval_requests (id, requested_action, requesting_agent, affected_resource, risk_level, policy, reason, status)
    VALUES
      (
        'appr-req-001',
        'Production Merge & Cloud Run Deployment',
        'agent-eng-pr-01',
        'ohi-stack/acc:main -> acc.onegodian.com',
        'HIGH',
        'POL-ENG-PROD-MERGE-V2',
        'Engineering Council completed 5 review passes. All smoke tests passed. Human operator authorization required to merge PR #43 and promote to production.',
        'PENDING'
      ),
      (
        'appr-req-002',
        'Elevate Agent Memory & Concurrency Quota',
        'agent-exec-gateway-01',
        'Agent [agent-exec-gateway-01] concurrency: 5 -> 10',
        'MEDIUM',
        'POL-RESOURCE-CONCURRENCY-01',
        'High queue volume incoming for automated PR reviews; requesting concurrency boost.',
        'PENDING'
      )
    ON CONFLICT (id) DO NOTHING;
  `);

  // Seed initial Authoritative Audit Record
  await db.query(`
    INSERT INTO audit_records (id, actor_type, actor_id, agent_id, action, authority_scope, policy_id, policy_hash, input_hash, output_hash, risk_level, decision, approval_status)
    VALUES
      (
        'aud-init-001',
        'system',
        'acc-core-system',
        NULL,
        'ACC_PLATFORM_BOOT_INITIALIZATION',
        'system.init',
        'POL-SYS-BOOT-01',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
        'f9e8d7c6b5a43210fedcba9876543210abcdef0123456789abcdef0123456789',
        'LOW',
        'ALLOW',
        'NOT_REQUIRED'
      )
    ON CONFLICT (id) DO NOTHING;
  `);
}

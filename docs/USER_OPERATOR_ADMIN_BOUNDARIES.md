# User, Operator and Administrator Separation

ACC at acc.onegodian.com hosts the unified OHI Command Console and Agent Command Console. Separate /console/dashboard (operator) from /admin (administrator). QuantumOHI user dashboard at quantumohi.com/dashboard is a separate application/data boundary. Every operator/admin API must validate server-side identity, tenant, roles, OCP policy, approval and audit. No admin datasets in ordinary operator payloads. Preserve existing routes and do not mark proposed routes operational without tests and deployment proof.

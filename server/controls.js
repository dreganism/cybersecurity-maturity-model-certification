// ============================================================
// CMMC 2.0 Controls & Domains — PRIVATE SERVER MODULE
// Weights are NEVER sent to the client.
// ============================================================

const DOMAINS = [
    { abbr: 'AC', name: 'Access Control', nist: '3.1' },
    { abbr: 'AT', name: 'Awareness and Training', nist: '3.2' },
    { abbr: 'AU', name: 'Audit and Accountability', nist: '3.3' },
    { abbr: 'CM', name: 'Configuration Management', nist: '3.4' },
    { abbr: 'IA', name: 'Identification and Authentication', nist: '3.5' },
    { abbr: 'IR', name: 'Incident Response', nist: '3.6' },
    { abbr: 'MA', name: 'Maintenance', nist: '3.7' },
    { abbr: 'MP', name: 'Media Protection', nist: '3.8' },
    { abbr: 'PS', name: 'Personnel Security', nist: '3.9' },
    { abbr: 'PE', name: 'Physical Protection', nist: '3.10' },
    { abbr: 'RA', name: 'Risk Assessment', nist: '3.11' },
    { abbr: 'CA', name: 'Security Assessment', nist: '3.12' },
    { abbr: 'SC', name: 'System and Communications Protection', nist: '3.13' },
    { abbr: 'SI', name: 'System and Information Integrity', nist: '3.14' }
];

const CONTROLS = [
    // ── AC — Access Control (22 controls) ──────────────────────
    { id:'AC.L1-3.1.1', level:1, domain:'AC', nist:'3.1.1', weight:5, text:'Limit information system access to authorized users, processes acting on behalf of authorized users, or devices (including other information systems).' },
    { id:'AC.L1-3.1.2', level:1, domain:'AC', nist:'3.1.2', weight:5, text:'Limit information system access to the types of transactions and functions that authorized users are permitted to execute.' },
    { id:'AC.L2-3.1.3', level:2, domain:'AC', nist:'3.1.3', weight:5, text:'Control the flow of CUI in accordance with approved authorizations.' },
    { id:'AC.L2-3.1.4', level:2, domain:'AC', nist:'3.1.4', weight:3, text:'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.' },
    { id:'AC.L2-3.1.5', level:2, domain:'AC', nist:'3.1.5', weight:5, text:'Employ the principle of least privilege, including for specific security functions and privileged accounts.' },
    { id:'AC.L2-3.1.6', level:2, domain:'AC', nist:'3.1.6', weight:1, text:'Use non-privileged accounts or roles when accessing nonsecurity functions.' },
    { id:'AC.L2-3.1.7', level:2, domain:'AC', nist:'3.1.7', weight:5, text:'Prevent non-privileged users from executing privileged functions and capture the execution of such functions in audit logs.' },
    { id:'AC.L2-3.1.8', level:2, domain:'AC', nist:'3.1.8', weight:3, text:'Limit unsuccessful logon attempts.' },
    { id:'AC.L2-3.1.9', level:2, domain:'AC', nist:'3.1.9', weight:1, text:'Provide privacy and security notices consistent with applicable CUI rules.' },
    { id:'AC.L2-3.1.10', level:2, domain:'AC', nist:'3.1.10', weight:1, text:'Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.' },
    { id:'AC.L2-3.1.11', level:2, domain:'AC', nist:'3.1.11', weight:3, text:'Terminate (automatically) a user session after a defined condition.' },
    { id:'AC.L2-3.1.12', level:2, domain:'AC', nist:'3.1.12', weight:5, text:'Monitor and control remote access sessions.' },
    { id:'AC.L2-3.1.13', level:2, domain:'AC', nist:'3.1.13', weight:5, text:'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.' },
    { id:'AC.L2-3.1.14', level:2, domain:'AC', nist:'3.1.14', weight:5, text:'Route remote access via managed access control points.' },
    { id:'AC.L2-3.1.15', level:2, domain:'AC', nist:'3.1.15', weight:3, text:'Authorize remote execution of privileged commands and remote access to security-relevant information.' },
    { id:'AC.L2-3.1.16', level:2, domain:'AC', nist:'3.1.16', weight:1, text:'Authorize wireless access prior to allowing such connections.' },
    { id:'AC.L2-3.1.17', level:2, domain:'AC', nist:'3.1.17', weight:5, text:'Protect wireless access using authentication and encryption.' },
    { id:'AC.L2-3.1.18', level:2, domain:'AC', nist:'3.1.18', weight:3, text:'Control connection of mobile devices.' },
    { id:'AC.L2-3.1.19', level:2, domain:'AC', nist:'3.1.19', weight:5, text:'Encrypt CUI on mobile devices and mobile computing platforms.' },
    { id:'AC.L1-3.1.20', level:1, domain:'AC', nist:'3.1.20', weight:5, text:'Verify and control/limit connections to and use of external information systems.' },
    { id:'AC.L2-3.1.21', level:2, domain:'AC', nist:'3.1.21', weight:1, text:'Limit use of portable storage devices on external systems.' },
    { id:'AC.L1-3.1.22', level:1, domain:'AC', nist:'3.1.22', weight:1, text:'Control information posted or processed on publicly accessible information systems.' },

    // ── AT — Awareness and Training (3 controls) ───────────────
    { id:'AT.L2-3.2.1', level:2, domain:'AT', nist:'3.2.1', weight:3, text:'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities and of the applicable policies, standards, and procedures related to the security of those systems.' },
    { id:'AT.L2-3.2.2', level:2, domain:'AT', nist:'3.2.2', weight:3, text:'Ensure that personnel are trained to carry out their assigned information security-related duties and responsibilities.' },
    { id:'AT.L2-3.2.3', level:2, domain:'AT', nist:'3.2.3', weight:3, text:'Provide security awareness training on recognizing and reporting potential indicators of insider threat.' },

    // ── AU — Audit and Accountability (9 controls) ─────────────
    { id:'AU.L2-3.3.1', level:2, domain:'AU', nist:'3.3.1', weight:5, text:'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.' },
    { id:'AU.L2-3.3.2', level:2, domain:'AU', nist:'3.3.2', weight:5, text:'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.' },
    { id:'AU.L2-3.3.3', level:2, domain:'AU', nist:'3.3.3', weight:1, text:'Review and update logged events.' },
    { id:'AU.L2-3.3.4', level:2, domain:'AU', nist:'3.3.4', weight:3, text:'Alert in the event of an audit logging process failure.' },
    { id:'AU.L2-3.3.5', level:2, domain:'AU', nist:'3.3.5', weight:3, text:'Correlate audit record review, analysis, and reporting processes to support organizational processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity.' },
    { id:'AU.L2-3.3.6', level:2, domain:'AU', nist:'3.3.6', weight:1, text:'Provide audit record reduction and report generation to support on-demand analysis and reporting.' },
    { id:'AU.L2-3.3.7', level:2, domain:'AU', nist:'3.3.7', weight:1, text:'Provide a system capability that compares and synchronizes internal system clocks with an authoritative source to generate time stamps for audit records.' },
    { id:'AU.L2-3.3.8', level:2, domain:'AU', nist:'3.3.8', weight:3, text:'Protect audit information and audit logging tools from unauthorized access, modification, and deletion.' },
    { id:'AU.L2-3.3.9', level:2, domain:'AU', nist:'3.3.9', weight:1, text:'Limit management of audit logging functionality to a subset of privileged users.' },

    // ── CM — Configuration Management (9 controls) ─────────────
    { id:'CM.L2-3.4.1', level:2, domain:'CM', nist:'3.4.1', weight:5, text:'Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.' },
    { id:'CM.L2-3.4.2', level:2, domain:'CM', nist:'3.4.2', weight:5, text:'Establish and enforce security configuration settings for information technology products employed in organizational systems.' },
    { id:'CM.L2-3.4.3', level:2, domain:'CM', nist:'3.4.3', weight:3, text:'Track, review, approve or disapprove, and log changes to organizational systems.' },
    { id:'CM.L2-3.4.4', level:2, domain:'CM', nist:'3.4.4', weight:3, text:'Analyze the security impact of changes prior to implementation.' },
    { id:'CM.L2-3.4.5', level:2, domain:'CM', nist:'3.4.5', weight:3, text:'Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational systems.' },
    { id:'CM.L2-3.4.6', level:2, domain:'CM', nist:'3.4.6', weight:3, text:'Employ the principle of least functionality by configuring organizational systems to provide only essential capabilities.' },
    { id:'CM.L2-3.4.7', level:2, domain:'CM', nist:'3.4.7', weight:3, text:'Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.' },
    { id:'CM.L2-3.4.8', level:2, domain:'CM', nist:'3.4.8', weight:3, text:'Apply deny-by-exception (blacklisting) policy to prevent the use of unauthorized software or deny-all, permit-by-exception (whitelisting) policy to allow the execution of authorized software.' },
    { id:'CM.L2-3.4.9', level:2, domain:'CM', nist:'3.4.9', weight:1, text:'Control and monitor user-installed software.' },

    // ── IA — Identification and Authentication (11 controls) ───
    { id:'IA.L1-3.5.1', level:1, domain:'IA', nist:'3.5.1', weight:5, text:'Identify information system users, processes acting on behalf of users, or devices.' },
    { id:'IA.L1-3.5.2', level:1, domain:'IA', nist:'3.5.2', weight:5, text:'Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational information systems.' },
    { id:'IA.L2-3.5.3', level:2, domain:'IA', nist:'3.5.3', weight:5, text:'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.' },
    { id:'IA.L2-3.5.4', level:2, domain:'IA', nist:'3.5.4', weight:5, text:'Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts.' },
    { id:'IA.L2-3.5.5', level:2, domain:'IA', nist:'3.5.5', weight:1, text:'Prevent reuse of identifiers for a defined period.' },
    { id:'IA.L2-3.5.6', level:2, domain:'IA', nist:'3.5.6', weight:1, text:'Disable identifiers after a defined period of inactivity.' },
    { id:'IA.L2-3.5.7', level:2, domain:'IA', nist:'3.5.7', weight:3, text:'Enforce a minimum password complexity and change of characters when new passwords are created.' },
    { id:'IA.L2-3.5.8', level:2, domain:'IA', nist:'3.5.8', weight:1, text:'Prohibit password reuse for a specified number of generations.' },
    { id:'IA.L2-3.5.9', level:2, domain:'IA', nist:'3.5.9', weight:1, text:'Allow temporary password use for system logons with an immediate change to a permanent password.' },
    { id:'IA.L2-3.5.10', level:2, domain:'IA', nist:'3.5.10', weight:5, text:'Store and transmit only cryptographically-protected passwords.' },
    { id:'IA.L2-3.5.11', level:2, domain:'IA', nist:'3.5.11', weight:1, text:'Obscure feedback of authentication information.' },

    // ── IR — Incident Response (3 controls) ────────────────────
    { id:'IR.L2-3.6.1', level:2, domain:'IR', nist:'3.6.1', weight:5, text:'Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.' },
    { id:'IR.L2-3.6.2', level:2, domain:'IR', nist:'3.6.2', weight:5, text:'Track, document, and report incidents to designated officials and/or authorities both internal and external to the organization.' },
    { id:'IR.L2-3.6.3', level:2, domain:'IR', nist:'3.6.3', weight:3, text:'Test the organizational incident response capability.' },

    // ── MA — Maintenance (6 controls) ──────────────────────────
    { id:'MA.L2-3.7.1', level:2, domain:'MA', nist:'3.7.1', weight:1, text:'Perform maintenance on organizational systems.' },
    { id:'MA.L2-3.7.2', level:2, domain:'MA', nist:'3.7.2', weight:3, text:'Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.' },
    { id:'MA.L2-3.7.3', level:2, domain:'MA', nist:'3.7.3', weight:3, text:'Ensure equipment removed for off-site maintenance is sanitized of any CUI.' },
    { id:'MA.L2-3.7.4', level:2, domain:'MA', nist:'3.7.4', weight:3, text:'Check media containing diagnostic and test programs for malicious code before the media are used in organizational systems.' },
    { id:'MA.L2-3.7.5', level:2, domain:'MA', nist:'3.7.5', weight:5, text:'Require multifactor authentication to establish nonlocal maintenance sessions via external network connections and terminate such connections when nonlocal maintenance is complete.' },
    { id:'MA.L2-3.7.6', level:2, domain:'MA', nist:'3.7.6', weight:3, text:'Supervise the maintenance activities of maintenance personnel without required access authorization.' },

    // ── MP — Media Protection (9 controls) ─────────────────────
    { id:'MP.L1-3.8.3', level:1, domain:'MP', nist:'3.8.3', weight:5, text:'Sanitize or destroy information system media containing Federal Contract Information before disposal or release for reuse.' },
    { id:'MP.L2-3.8.1', level:2, domain:'MP', nist:'3.8.1', weight:3, text:'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.' },
    { id:'MP.L2-3.8.2', level:2, domain:'MP', nist:'3.8.2', weight:3, text:'Limit access to CUI on system media to authorized users.' },
    { id:'MP.L2-3.8.4', level:2, domain:'MP', nist:'3.8.4', weight:1, text:'Mark media with necessary CUI markings and distribution limitations.' },
    { id:'MP.L2-3.8.5', level:2, domain:'MP', nist:'3.8.5', weight:3, text:'Control access to media containing CUI and maintain accountability for media during transport outside of controlled areas.' },
    { id:'MP.L2-3.8.6', level:2, domain:'MP', nist:'3.8.6', weight:5, text:'Implement cryptographic mechanisms to protect the confidentiality of CUI stored on digital media during transport unless otherwise protected by alternative physical safeguards.' },
    { id:'MP.L2-3.8.7', level:2, domain:'MP', nist:'3.8.7', weight:3, text:'Control the use of removable media on system components.' },
    { id:'MP.L2-3.8.8', level:2, domain:'MP', nist:'3.8.8', weight:1, text:'Prohibit the use of portable storage devices when such devices have no identifiable owner.' },
    { id:'MP.L2-3.8.9', level:2, domain:'MP', nist:'3.8.9', weight:3, text:'Protect the confidentiality of backup CUI at storage locations.' },

    // ── PS — Personnel Security (2 controls) ───────────────────
    { id:'PS.L2-3.9.1', level:2, domain:'PS', nist:'3.9.1', weight:3, text:'Screen individuals prior to authorizing access to organizational systems containing CUI.' },
    { id:'PS.L2-3.9.2', level:2, domain:'PS', nist:'3.9.2', weight:3, text:'Ensure that organizational systems containing CUI are protected during and after personnel actions such as terminations and transfers.' },

    // ── PE — Physical Protection (6 controls) ──────────────────
    { id:'PE.L1-3.10.1', level:1, domain:'PE', nist:'3.10.1', weight:5, text:'Limit physical access to organizational information systems, equipment, and the respective operating environments to authorized individuals.' },
    { id:'PE.L2-3.10.2', level:2, domain:'PE', nist:'3.10.2', weight:3, text:'Protect and monitor the physical facility and support infrastructure for organizational systems.' },
    { id:'PE.L1-3.10.3', level:1, domain:'PE', nist:'3.10.3', weight:1, text:'Escort visitors and monitor visitor activity.' },
    { id:'PE.L1-3.10.4', level:1, domain:'PE', nist:'3.10.4', weight:1, text:'Maintain audit logs of physical access.' },
    { id:'PE.L1-3.10.5', level:1, domain:'PE', nist:'3.10.5', weight:1, text:'Control and manage physical access devices.' },
    { id:'PE.L2-3.10.6', level:2, domain:'PE', nist:'3.10.6', weight:3, text:'Enforce safeguarding measures for CUI at alternate work sites.' },

    // ── RA — Risk Assessment (3 controls) ──────────────────────
    { id:'RA.L2-3.11.1', level:2, domain:'RA', nist:'3.11.1', weight:3, text:'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.' },
    { id:'RA.L2-3.11.2', level:2, domain:'RA', nist:'3.11.2', weight:5, text:'Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems and applications are identified.' },
    { id:'RA.L2-3.11.3', level:2, domain:'RA', nist:'3.11.3', weight:5, text:'Remediate vulnerabilities in accordance with risk assessments.' },

    // ── CA — Security Assessment (4 controls) ──────────────────
    { id:'CA.L2-3.12.1', level:2, domain:'CA', nist:'3.12.1', weight:3, text:'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.' },
    { id:'CA.L2-3.12.2', level:2, domain:'CA', nist:'3.12.2', weight:5, text:'Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational systems.' },
    { id:'CA.L2-3.12.3', level:2, domain:'CA', nist:'3.12.3', weight:3, text:'Monitor security controls on an ongoing basis to ensure the continued effectiveness of the controls.' },
    { id:'CA.L2-3.12.4', level:2, domain:'CA', nist:'3.12.4', weight:5, text:'Develop, document, and periodically update system security plans that describe system boundaries, system environments of operation, how security requirements are implemented, and the relationships with or connections to other systems.' },

    // ── SC — System and Communications Protection (16 controls)
    { id:'SC.L1-3.13.1', level:1, domain:'SC', nist:'3.13.1', weight:5, text:'Monitor, control, and protect communications (i.e., information transmitted or received by organizational systems) at the external boundaries and key internal boundaries of organizational systems.' },
    { id:'SC.L2-3.13.2', level:2, domain:'SC', nist:'3.13.2', weight:3, text:'Employ architectural designs, software development techniques, and systems engineering principles that promote effective information security within organizational systems.' },
    { id:'SC.L2-3.13.3', level:2, domain:'SC', nist:'3.13.3', weight:3, text:'Separate user functionality from system management functionality.' },
    { id:'SC.L2-3.13.4', level:2, domain:'SC', nist:'3.13.4', weight:3, text:'Prevent unauthorized and unintended information transfer via shared system resources.' },
    { id:'SC.L1-3.13.5', level:1, domain:'SC', nist:'3.13.5', weight:5, text:'Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.' },
    { id:'SC.L2-3.13.6', level:2, domain:'SC', nist:'3.13.6', weight:5, text:'Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).' },
    { id:'SC.L2-3.13.7', level:2, domain:'SC', nist:'3.13.7', weight:3, text:'Prevent remote devices from simultaneously establishing non-remote connections with organizational systems and communicating via some other connection to resources in external networks (i.e., split tunneling).' },
    { id:'SC.L2-3.13.8', level:2, domain:'SC', nist:'3.13.8', weight:5, text:'Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards.' },
    { id:'SC.L2-3.13.9', level:2, domain:'SC', nist:'3.13.9', weight:1, text:'Terminate network connections associated with communications sessions at the end of the sessions or after a defined period of inactivity.' },
    { id:'SC.L2-3.13.10', level:2, domain:'SC', nist:'3.13.10', weight:3, text:'Establish and manage cryptographic keys for cryptography employed in organizational systems.' },
    { id:'SC.L2-3.13.11', level:2, domain:'SC', nist:'3.13.11', weight:5, text:'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.' },
    { id:'SC.L2-3.13.12', level:2, domain:'SC', nist:'3.13.12', weight:1, text:'Prohibit remote activation of collaborative computing devices and provide indication of devices in use to users present at the device.' },
    { id:'SC.L2-3.13.13', level:2, domain:'SC', nist:'3.13.13', weight:1, text:'Control and monitor the use of mobile code.' },
    { id:'SC.L2-3.13.14', level:2, domain:'SC', nist:'3.13.14', weight:1, text:'Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.' },
    { id:'SC.L2-3.13.15', level:2, domain:'SC', nist:'3.13.15', weight:5, text:'Protect the authenticity of communications sessions.' },
    { id:'SC.L2-3.13.16', level:2, domain:'SC', nist:'3.13.16', weight:5, text:'Protect the confidentiality of CUI at rest.' },

    // ── SI — System and Information Integrity (7 controls) ─────
    { id:'SI.L1-3.14.1', level:1, domain:'SI', nist:'3.14.1', weight:5, text:'Identify, report, and correct information and information system flaws in a timely manner.' },
    { id:'SI.L1-3.14.2', level:1, domain:'SI', nist:'3.14.2', weight:5, text:'Provide protection from malicious code at appropriate locations within organizational information systems.' },
    { id:'SI.L2-3.14.3', level:2, domain:'SI', nist:'3.14.3', weight:3, text:'Monitor system security alerts and advisories and take action in response.' },
    { id:'SI.L1-3.14.4', level:1, domain:'SI', nist:'3.14.4', weight:3, text:'Update malicious code protection mechanisms when new releases are available.' },
    { id:'SI.L1-3.14.5', level:1, domain:'SI', nist:'3.14.5', weight:3, text:'Perform periodic scans of the information system and real-time scans of files from external sources as files are downloaded, opened, or executed.' },
    { id:'SI.L2-3.14.6', level:2, domain:'SI', nist:'3.14.6', weight:5, text:'Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.' },
    { id:'SI.L2-3.14.7', level:2, domain:'SI', nist:'3.14.7', weight:5, text:'Identify unauthorized use of organizational systems.' }
];

module.exports = { DOMAINS, CONTROLS };

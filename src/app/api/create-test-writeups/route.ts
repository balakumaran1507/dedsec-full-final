/**
 * API Route: Create Test Writeups
 * POST /api/create-test-writeups
 */

import { NextResponse } from 'next/server';
import { createWriteup } from '@/lib/db/writeups';

const testWriteups = [
  {
    title: 'SQL Injection in Login Form',
    challengeName: 'Easy Login',
    ctfName: 'HackTheBox',
    category: 'Web' as const,
    difficulty: 'Easy',
    content: '# SQL Injection Writeup\n\nFound SQL injection vulnerability in login form.\n\n## Payload\n```\n\' OR 1=1--\n```\n\n## Flag\nHTB{sql_1nj3ct10n_ftw}',
    tags: ['sql', 'injection', 'web'],
    authorName: 'Test User',
    authorUid: 'test-uid-001'
  },
  {
    title: 'Buffer Overflow Exploit',
    challengeName: 'Stack Overflow',
    ctfName: 'PicoCTF 2024',
    category: 'Pwn' as const,
    difficulty: 'Medium',
    content: '# Buffer Overflow\n\nExploited buffer overflow to get shell access.\n\n## Exploit\nUsed pwntools to craft payload.\n\n## Flag\npico{buff3r_0v3rfl0w}',
    tags: ['pwn', 'buffer-overflow', 'stack'],
    authorName: 'Pwn Master',
    authorUid: 'test-uid-002'
  },
  {
    title: 'RSA Weak Keys Attack',
    challengeName: 'Crypto Challenge 1',
    ctfName: 'CyberSecurityRumble',
    category: 'Crypto' as const,
    difficulty: 'Hard',
    content: '# RSA Weak Keys\n\nFactored weak RSA key using yafu.\n\n## Solution\nFound p and q, computed private key.\n\n## Flag\nCSR{w34k_rsa_k3ys}',
    tags: ['crypto', 'rsa', 'factorization'],
    authorName: 'Crypto Expert',
    authorUid: 'test-uid-003'
  },
  {
    title: 'Reverse Engineering ARM Binary',
    challengeName: 'ARM Challenge',
    ctfName: 'DEF CON CTF',
    category: 'Reversing' as const,
    difficulty: 'Insane',
    content: '# ARM Reversing\n\nReversed ARM binary using Ghidra.\n\n## Analysis\nIdentified key validation algorithm.\n\n## Flag\nDEFCON{arm_r3v3rs1ng}',
    tags: ['reversing', 'arm', 'ghidra'],
    authorName: 'Rev Master',
    authorUid: 'test-uid-004'
  },
  {
    title: 'XSS to Account Takeover',
    challengeName: 'Stored XSS',
    ctfName: 'Google CTF',
    category: 'Web' as const,
    difficulty: 'Medium',
    content: '# XSS Exploitation\n\nFound stored XSS, escalated to account takeover.\n\n## Payload\n```js\n<script>fetch("/admin?cookie="+document.cookie)</script>\n```\n\n## Flag\ngCTF{xss_1s_p0w3rful}',
    tags: ['xss', 'web', 'javascript'],
    authorName: 'Web Hacker',
    authorUid: 'test-uid-005'
  },
  {
    title: 'Memory Forensics Challenge',
    challengeName: 'Memory Dump Analysis',
    ctfName: 'DFIR CTF',
    category: 'Forensics' as const,
    difficulty: 'Medium',
    content: '# Memory Forensics\n\nAnalyzed memory dump using Volatility.\n\n## Tools Used\n- Volatility 3\n- strings\n- grep\n\n## Flag\nDFIR{m3m0ry_f0r3ns1cs}',
    tags: ['forensics', 'memory', 'volatility'],
    authorName: 'Forensics Pro',
    authorUid: 'test-uid-006'
  },
  {
    title: 'AES ECB Mode Oracle',
    challengeName: 'ECB Oracle',
    ctfName: 'CryptoCTF',
    category: 'Crypto' as const,
    difficulty: 'Easy',
    content: '# ECB Mode Attack\n\nExploited ECB mode oracle to decrypt flag.\n\n## Method\nByte-by-byte oracle attack.\n\n## Flag\nCRYPTO{3cb_1s_b4d}',
    tags: ['crypto', 'aes', 'ecb'],
    authorName: 'Crypto Expert',
    authorUid: 'test-uid-003'
  },
  {
    title: 'OSINT Social Media Investigation',
    challengeName: 'Find The Hacker',
    ctfName: 'TraceLabs CTF',
    category: 'Misc' as const,
    difficulty: 'Easy',
    content: '# OSINT Challenge\n\nTracked target across multiple platforms.\n\n## Tools\n- sherlock\n- Google dorking\n- EXIF data\n\n## Flag\nTRACE{0s1nt_m4st3r}',
    tags: ['osint', 'social-media', 'recon'],
    authorName: 'OSINT Specialist',
    authorUid: 'test-uid-007'
  },
  {
    title: 'Format String Vulnerability',
    challengeName: 'Printf Hell',
    ctfName: 'CSAW CTF',
    category: 'Pwn' as const,
    difficulty: 'Hard',
    content: '# Format String\n\nExploited printf format string to leak stack.\n\n## Exploit\n```python\npayload = "%p " * 20\n```\n\n## Flag\nCSAW{f0rm4t_str1ng_pwn}',
    tags: ['pwn', 'format-string', 'leak'],
    authorName: 'Pwn Master',
    authorUid: 'test-uid-002'
  },
  {
    title: 'Steganography PNG Analysis',
    challengeName: 'Hidden Message',
    ctfName: 'NahamCon CTF',
    category: 'Forensics' as const,
    difficulty: 'Easy',
    content: '# Steganography\n\nExtracted hidden data from PNG using zsteg.\n\n## Command\n```bash\nzsteg -a image.png\n```\n\n## Flag\nNAHAM{st3g4n0gr4phy}',
    tags: ['forensics', 'steganography', 'png'],
    authorName: 'Stego Master',
    authorUid: 'test-uid-008'
  },
  {
    title: 'JWT Token Manipulation',
    challengeName: 'Broken Auth',
    ctfName: 'PortSwigger Labs',
    category: 'Web' as const,
    difficulty: 'Medium',
    content: '# JWT Attack\n\nManipulated JWT token to gain admin access.\n\n## Vulnerability\nNone algorithm attack.\n\n## Flag\nPORT{jwt_n0n3_alg}',
    tags: ['web', 'jwt', 'auth'],
    authorName: 'Web Hacker',
    authorUid: 'test-uid-005'
  },
  {
    title: 'Binary Exploitation with ROP',
    challengeName: 'ROP Chains',
    ctfName: 'pwnable.kr',
    category: 'Pwn' as const,
    difficulty: 'Insane',
    content: '# ROP Chain Exploit\n\nBuilt ROP chain to bypass DEP/NX.\n\n## Technique\nUsed ROPgadget to find gadgets.\n\n## Flag\npwn{r0p_ch41n_m4st3r}',
    tags: ['pwn', 'rop', 'exploitation'],
    authorName: 'Pwn Master',
    authorUid: 'test-uid-002'
  }
];

export async function POST() {
  try {
    let created = 0;
    const errors: string[] = [];

    for (const writeup of testWriteups) {
      try {
        await createWriteup(writeup as any);
        created++;
      } catch (error) {
        errors.push(`${writeup.title}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${created}/${testWriteups.length} test writeups`,
      created,
      total: testWriteups.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error creating test writeups:', error);
    return NextResponse.json(
      { error: 'Failed to create test writeups' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to create test writeups',
    endpoint: '/api/create-test-writeups',
    method: 'POST',
  });
}

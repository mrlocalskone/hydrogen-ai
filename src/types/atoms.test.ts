import { describe, it, expect } from 'vitest';
import { parseAtomCommand } from './atoms';

describe('parseAtomCommand', () => {
  it('parses /mermaid command', () => {
    const result = parseAtomCommand('/mermaid diagram');
    expect(result).toEqual({ type: 'diagram', params: 'diagram' });
  });

  it('parses /diagram command', () => {
    const result = parseAtomCommand('/diagram flowchart TD');
    expect(result).toEqual({ type: 'diagram', params: 'flowchart TD' });
  });

  it('parses /yt command', () => {
    const result = parseAtomCommand('/yt cool video');
    expect(result).toEqual({ type: 'youtube', params: 'cool video' });
  });

  it('parses /web command', () => {
    const result = parseAtomCommand('/web quantum computers');
    expect(result).toEqual({ type: 'websearch', params: 'quantum computers' });
  });
});


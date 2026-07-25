'use client';

import { useState, useEffect } from 'react';
import { SkillDefinition, RuleDefinition, TemplateDefinition } from '@mystack/core';
import { Badge } from '@/components/Badge';

export default function CatalogPage() {
  const [tab, setTab] = useState<'skills' | 'rules' | 'templates'>('skills');
  const [skills, setSkills] = useState<SkillDefinition[]>([]);
  const [rules, setRules] = useState<RuleDefinition[]>([]);
  const [templates, setTemplates] = useState<TemplateDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/skills').then((res) => res.json()),
      fetch('/api/rules').then((res) => res.json()),
      fetch('/api/templates').then((res) => res.json()),
    ]).then(([skillData, ruleData, templateData]) => {
      setSkills(skillData.skills ?? []);
      setRules(ruleData.rules ?? []);
      setTemplates(templateData.templates ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800 }}>
            Skills, Rules & Templates Catalog
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Reusable architectural practices, quality constraints, and project scaffolds
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            background: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
          }}
        >
          <button
            onClick={() => setTab('skills')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: tab === 'skills' ? 'var(--accent-primary)' : 'transparent',
              color: tab === 'skills' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Skills ({skills.length})
          </button>
          <button
            onClick={() => setTab('rules')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: tab === 'rules' ? 'var(--accent-primary)' : 'transparent',
              color: tab === 'rules' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Rules ({rules.length})
          </button>
          <button
            onClick={() => setTab('templates')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: tab === 'templates' ? 'var(--accent-primary)' : 'transparent',
              color: tab === 'templates' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Templates ({templates.length})
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading catalog definitions...</p>
      ) : tab === 'skills' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {skills.map((skill) => (
            <div key={skill.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{skill.name}</h3>
                <Badge variant="secondary">{skill.category}</Badge>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{skill.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skill.tags.map((tag) => (
                  <Badge key={tag} variant="neutral">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div style={{ marginTop: '8px' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Instructions snippet:</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontStyle: 'italic', background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px' }}>
                  {skill.instructions.slice(0, 140)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : tab === 'rules' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {rules.map((rule) => (
            <div key={rule.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{rule.name}</h3>
                <Badge variant={rule.severity === 'error' ? 'danger' : rule.severity === 'warning' ? 'warning' : 'primary'}>
                  {rule.severity.toUpperCase()}
                </Badge>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{rule.description}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Category: <span style={{ color: 'var(--text-primary)' }}>{rule.category}</span> | Enforcement: <span style={{ color: 'var(--accent-secondary)' }}>{rule.enforcement}</span>
              </div>

              {rule.examples && rule.examples.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>✔ Good Pattern</div>
                  <pre style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', color: '#5eead4' }}>
                    {rule.examples[0]?.good}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {templates.map((template) => (
            <div key={template.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{template.name}</h3>
                <Badge variant="primary">{template.category}</Badge>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{template.description}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Files: <span style={{ color: 'var(--text-primary)' }}>{template.files.length}</span> | Variables: <span style={{ color: 'var(--accent-secondary)' }}>{template.variables.length}</span>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {template.variables.map((v) => (
                  <Badge key={v.name} variant="neutral">
                    {v.name} {v.required ? '*' : ''}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

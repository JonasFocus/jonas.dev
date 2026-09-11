'use client';

import {
  Check,
  FileText,
  PenTool,
  Code2,
  Rocket,
  ArrowUpRight,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import './process-section.css';

const stages = [
  {
    id: 'define',
    number: '01',
    Icon: FileText,
    title: 'Define the project',
    summary: 'A shared plan before the first pixel.',
    label: 'THE STARTING POINT',
    heading: 'A clear scope.\nA shared direction.',
    description: 'We turn your idea into a plan you can make a decision on.',
    deliverables: [
      'Goals and the work included',
      'A proposal, price, and timeline',
      'Who supplies content and assets',
    ],
    outcome: 'Your project, clearly defined',
  },
  {
    id: 'design',
    number: '02',
    Icon: PenTool,
    title: 'Design the experience',
    summary: 'Something to see, discuss, and refine.',
    label: 'MAKING IT TANGIBLE',
    heading: 'See the idea\ntake shape.',
    description:
      'Review the structure, visual direction, and important interactions before the full build.',
    deliverables: [
      'Page structure and key journeys',
      'A visual direction to review',
      'Feedback worked into the design',
    ],
    outcome: 'A direction we agree on',
  },
  {
    id: 'build',
    number: '03',
    Icon: Code2,
    title: 'Build it together',
    summary: 'Working progress, shared along the way.',
    label: 'FROM DESIGN TO PRODUCT',
    heading: 'Real progress.\nIn your hands.',
    description:
      'Follow the build through working previews, with checkpoints for feedback.',
    deliverables: [
      'A working development preview',
      'The agreed features and integrations',
      'Responsive and interaction checks',
    ],
    outcome: 'A product you can try',
  },
  {
    id: 'launch',
    number: '04',
    Icon: Rocket,
    title: 'Launch and look ahead',
    summary: 'A proper handover. A plan for what’s next.',
    label: 'THE NEXT CHAPTER',
    heading: 'Ready to launch.\nRoom to grow.',
    description:
      'Put your project into the world with the access and information you need to run it.',
    deliverables: [
      'Launch and source code handover',
      'Access and operating instructions',
      'Updates and support agreed together',
    ],
    outcome: 'Beyond launch, with a plan',
  },
];

export function ProcessSection() {
  return (
    <section
      className="workflow-section wrap"
      id="process"
      aria-labelledby="workflow-heading"
    >
      <Tabs defaultValue="define" className="workflow-tabs">
        <div className="workflow-overview">
          <div className="workflow-intro reveal">
            <p className="eyebrow">HOW WE WORK</p>
            <h2 id="workflow-heading">
              A clear path
              <br />
              <span>from idea to launch.</span>
            </h2>
            <p>
              Small, visible steps. Clear decisions. You’ll know what we’re
              working on and what comes next.
            </p>
            <a href="#contact" className="workflow-link">
              Let’s talk through your idea <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="workflow-canvas">
            {stages.map((stage) => (
              <TabsContent
                key={stage.id}
                value={stage.id}
                className="workflow-panel"
              >
                <div className="workflow-panel-top">
                  <span className="workflow-panel-icon">
                    <stage.Icon size={21} strokeWidth={1.5} />
                  </span>
                  <span>{stage.label}</span>
                  <span className="workflow-panel-number">
                    {stage.number} / 04
                  </span>
                </div>
                <h3>
                  {stage.heading.split('\n').map((line, index) => (
                    <span key={line}>
                      {index > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="workflow-panel-description">
                  {stage.description}
                </p>
                <ul>
                  {stage.deliverables.map((item) => (
                    <li key={item}>
                      <Check size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="workflow-output">
                  <span>WHAT YOU GET</span>
                  <strong>{stage.outcome}</strong>
                  <ArrowUpRight size={17} />
                </div>
              </TabsContent>
            ))}
          </div>
        </div>
        <TabsList
          className="workflow-steps"
          aria-label="Explore the four project stages"
        >
          {stages.map((stage) => (
            <TabsTrigger
              className="workflow-step"
              key={stage.id}
              value={stage.id}
            >
              <span className="workflow-step-top">
                <span>{stage.number}</span>
                <stage.Icon size={18} strokeWidth={1.5} />
              </span>
              <span className="workflow-step-title">{stage.title}</span>
              <span className="workflow-step-summary">{stage.summary}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="workflow-note">
        Scope, review checkpoints, and ongoing support are agreed for your
        project.
      </p>
    </section>
  );
}

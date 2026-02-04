/**
 * Demo Registry
 *
 * This file exports all available demos. To add a new demo:
 *
 * 1. Create a new folder in src/demos/ with your demo name (e.g., src/demos/my-demo/)
 * 2. Create the demo component (e.g., src/demos/my-demo/MyDemo.jsx)
 * 3. Import and register it here
 *
 * Demo format:
 * {
 *   title: 'Demo Title',
 *   description: 'A brief description of what this demo showcases',
 *   icon: '🎯',  // Optional emoji icon
 *   tags: ['tag1', 'tag2'],  // Optional tags for categorization
 *   component: YourDemoComponent
 * }
 */

// Import demo components here
import MindGrid from './mind-grid/MindGrid'
import DevPath from './dev-path/DevPath'
import BuildStory from './build-story/BuildStory'
import SecureScan from './secure-scan/SecureScan'
import AbstractionExplorer from './abstraction-explorer/AbstractionExplorer'
import Blackjack from './blackjack/Blackjack'
import IkigaiExplorer from './ikigai-explorer/IkigaiExplorer'

// Register all demos here
export const demos = {
  'build-story': {
    title: 'How This Was Built',
    description: 'An interactive story of the human-AI collaboration that created these demos. See the conversation, decisions, and technology behind it all.',
    icon: '📖',
    tags: ['story', 'education', 'collaboration', 'meta'],
    component: BuildStory
  },
  'mind-grid': {
    title: 'Mind Grid',
    description: 'A pattern memory game with evolving mechanics. Test your spatial reasoning through 30+ levels of increasing challenge.',
    icon: '🧠',
    tags: ['game', 'puzzle', 'memory', 'mobile-friendly'],
    component: MindGrid
  },
  'dev-path': {
    title: 'DevPath',
    description: 'A productivity app for CS students to build career-ready habits, track skills, and prepare for the AI-era job market.',
    icon: '🚀',
    tags: ['productivity', 'career', 'habits', 'mobile-friendly'],
    component: DevPath
  },
  'secure-scan': {
    title: 'SecureScan',
    description: 'Analyze website security headers and configuration. Get a security score and actionable recommendations.',
    icon: '🛡️',
    tags: ['security', 'analysis', 'web', 'educational'],
    component: SecureScan
  },
  'abstraction-explorer': {
    title: 'Abstraction Explorer',
    description: 'Discover how layers of abstraction work across programming, physics, money, and more. Interactive exploration with aha moments.',
    icon: '🧅',
    tags: ['education', 'concepts', 'interactive', 'mobile-friendly'],
    component: AbstractionExplorer
  },
  'blackjack': {
    title: 'Blackjack',
    description: 'Classic casino card game with betting, hit/stand/double mechanics, and animated card dealing.',
    icon: '🃏',
    tags: ['game', 'cards', 'casino', 'mobile-friendly'],
    component: Blackjack
  },
  'ikigai-explorer': {
    title: 'Ikigai Explorer',
    description: 'Discover your reason for being through guided self-reflection. Explore what you love, what you\'re good at, what the world needs, and what you can be paid for.',
    icon: '🔮',
    tags: ['self-discovery', 'education', 'interactive', 'mobile-friendly'],
    component: IkigaiExplorer
  },
}

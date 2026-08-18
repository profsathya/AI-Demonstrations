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
import Chess from './chess/Chess'
import BigOExplorer from './bigo-explorer/BigOExplorer'
import ThaiCooking from './thai-cooking/ThaiCooking'
import NavAssist from './nav-assist/NavAssist'
import PassVault from './pass-vault/PassVault'
import VisionAI from './vision-ai/VisionAI'
import InvasiveWatch from './invasive-watch/InvasiveWatch'
import NativePlants from './native-plants/NativePlants'
import MindfulU from './mindful-u/MindfulU'
import CampusHub from './campus-hub/CampusHub'
import TeamChat from './team-chat/TeamChat'
import TransitFlow from './transit-flow/TransitFlow'
import TAConnect from './ta-connect/TAConnect'
import Solitaire from './solitaire/Solitaire'
import Tetris from './tetris/Tetris'
import CampusCompass from './campus-compass/CampusCompass'

// Register all demos here
export const demos = {
  'campus-compass': {
    title: 'Campus Compass',
    description: 'A student resource navigator: ask in plain language, browse the full campus directory, get recommendations for your situation, and track the deadlines that cost money when missed.',
    icon: '🧭',
    tags: ['education', 'search', 'student life', 'mobile-friendly'],
    component: CampusCompass
  },
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
  'chess': {
    title: 'Chess',
    description: 'Full chess game with all rules: castling, en passant, promotion, check/checkmate detection. Play against a friend!',
    icon: '♟️',
    tags: ['game', 'strategy', 'classic', 'mobile-friendly'],
    component: Chess
  },
  'bigo-explorer': {
    title: 'Big O Explorer',
    description: 'Master time complexity through real-world scenarios. Choose social media, gaming, music, or food delivery — learn O(1) through O(2^n) with retrieval practice and adaptive quizzes.',
    icon: '📊',
    tags: ['education', 'CS', 'algorithms', 'interactive', 'mobile-friendly'],
    component: BigOExplorer
  },
  'thai-cooking': {
    title: 'Thai Cooking Mastery',
    description: 'Master Thai cuisine through interactive scenarios. Choose street food, curries, soups, or everyday Thai — learn flavor balance, aromatics, and wok skills with retrieval practice and adaptive quizzes.',
    icon: '🍜',
    tags: ['education', 'cooking', 'interactive', 'mobile-friendly'],
    component: ThaiCooking
  },
  'nav-assist': {
    title: 'NavAssist',
    description: 'Wearable navigation for visually impaired. Simulates obstacle detection, haptic feedback, and voice guidance for independent navigation.',
    icon: '👁️',
    tags: ['accessibility', 'hardware', 'navigation', 'mobile-friendly'],
    component: NavAssist
  },
  'pass-vault': {
    title: 'PassVault',
    description: 'Password manager for students and faculty. Secure credential storage with categories, password generator, and strength analysis.',
    icon: '🔐',
    tags: ['security', 'productivity', 'education', 'mobile-friendly'],
    component: PassVault
  },
  'vision-ai': {
    title: 'VisionAI',
    description: 'Image recognition software demo. Upload images to see simulated ML object detection, scene classification, and color analysis.',
    icon: '👀',
    tags: ['AI', 'ML', 'computer-vision', 'mobile-friendly'],
    component: VisionAI
  },
  'invasive-watch': {
    title: 'InvasiveWatch',
    description: 'Invasive species tracker for citizen science. Identify, report, and track invasive species sightings in your area.',
    icon: '🌿',
    tags: ['environment', 'citizen-science', 'education', 'mobile-friendly'],
    component: InvasiveWatch
  },
  'native-plants': {
    title: 'NativePlants',
    description: 'Native plant reporter and identification guide. Explore local flora, log sightings, and learn about wildlife-friendly gardening.',
    icon: '🌻',
    tags: ['environment', 'nature', 'education', 'mobile-friendly'],
    component: NativePlants
  },
  'mindful-u': {
    title: 'MindfulU',
    description: 'Mental wellness tracker for students. Daily mood check-ins, breathing exercises, insights, and campus support resources.',
    icon: '🧘',
    tags: ['wellness', 'mental-health', 'student-life', 'mobile-friendly'],
    component: MindfulU
  },
  'campus-hub': {
    title: 'CampusHub',
    description: 'Central directory for campus and local resources. Find academic support, health services, financial aid, and events in one place.',
    icon: '🏛️',
    tags: ['campus', 'resources', 'directory', 'mobile-friendly'],
    component: CampusHub
  },
  'team-chat': {
    title: 'TeamChat',
    description: 'Simple team messaging app. Channels, direct messages, reactions, and real-time communication for smaller teams.',
    icon: '💬',
    tags: ['communication', 'productivity', 'collaboration', 'mobile-friendly'],
    component: TeamChat
  },
  'transit-flow': {
    title: 'TransitFlow',
    description: 'Better public transit app with real-time arrivals, crowding indicators, trip planning, and service alerts.',
    icon: '🚇',
    tags: ['transit', 'navigation', 'city', 'mobile-friendly'],
    component: TransitFlow
  },
  'ta-connect': {
    title: 'TAConnect',
    description: 'TA office hour directory and queue system. Find TAs, see availability, join virtual queues, and get help faster.',
    icon: '👨‍🏫',
    tags: ['education', 'campus', 'student-life', 'mobile-friendly'],
    component: TAConnect
  },
  'solitaire': {
    title: 'Solitaire',
    description: 'Classic Klondike solitaire with guaranteed winnable deals, hint system, unlimited undo, and strategy tips to improve your game.',
    icon: '🃏',
    tags: ['game', 'cards', 'strategy', 'learning', 'mobile-friendly'],
    component: Solitaire
  },
  'tetris': {
    title: 'Tetris',
    description: 'Classic block-stacking puzzle game with ghost pieces, hold system, next queue, 15 speed levels, and touch controls for mobile.',
    icon: '🧱',
    tags: ['game', 'puzzle', 'classic', 'arcade', 'mobile-friendly'],
    component: Tetris
  },
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WORKSPACES } from '../../data/workspaces';
import { Workspace, FilterCategory } from '../../types';

export const SUGGESTED_QUESTIONS: string[] = [
  'What is Deskora?',
  'What is the cheapest workspace?',
  'Which spaces are under ₹500?',
  'Show creative spaces',
  'How much is Maison Botanica?',
  'Can I save a workspace?',
  'How does Book Desk work?',
  'Is payment available?',
];

export interface AssistantResponse {
  text: string;
  workspaceCards?: Workspace[];
  suggestedAction?: { label: string; onClick: () => void };
}

interface AssistantLogicCallbacks {
  isFavorite: (id: string) => boolean;
  onSelectWorkspace: (workspace: Workspace) => void;
  onApplyFilter: (filter: FilterCategory) => void;
  onApplySearch?: (query: string) => void;
}

/**
 * Pure evaluation function for parsing user queries and generating tailored responses
 * based on Deskora's curated 5-workspace dataset.
 */
export function generateAssistantResponse(
  query: string,
  callbacks: AssistantLogicCallbacks
): AssistantResponse {
  const q = query.toLowerCase().trim();
  const { isFavorite, onSelectWorkspace, onApplyFilter } = callbacks;

  // Specific workspace named query (e.g. "How much is Maison Botanica?")
  const namedWorkspace = WORKSPACES.find((w) => {
    const lower = w.name.toLowerCase();
    if (q.includes(lower)) return true;
    if (w.id === 'deskora-001' && (q.includes('sunlit') || q.includes('atelier'))) return true;
    if (w.id === 'deskora-002' && (q.includes('maison') || q.includes('botanica'))) return true;
    if (w.id === 'deskora-003' && (q.includes('velvet') || q.includes('study house'))) return true;
    if (w.id === 'deskora-004' && (q.includes('glasshouse') || q.includes('loft'))) return true;
    if (w.id === 'deskora-005' && (q.includes('solitude') || q.includes('terrace'))) return true;
    return false;
  });

  if (namedWorkspace) {
    const isPriceQuery =
      q.includes('how much') ||
      q.includes('cost') ||
      q.includes('price') ||
      q.includes('rent') ||
      q.includes('rate') ||
      q.includes('fee');

    if (isPriceQuery) {
      return {
        text: `**${namedWorkspace.name}** in ${namedWorkspace.location} is **₹${namedWorkspace.rentPerDay}/day**. It features ${namedWorkspace.amenities.slice(0, 3).join(', ')} and a ${namedWorkspace.rating}★ guest rating.`,
        workspaceCards: [namedWorkspace],
        suggestedAction: {
          label: `View ${namedWorkspace.name}`,
          onClick: () => onSelectWorkspace(namedWorkspace),
        },
      };
    }

    return {
      text: `**${namedWorkspace.name}** is a ${namedWorkspace.type.toLowerCase()} located in ${namedWorkspace.location} at **₹${namedWorkspace.rentPerDay}/day**.\n\n${namedWorkspace.description}`,
      workspaceCards: [namedWorkspace],
      suggestedAction: {
        label: `View ${namedWorkspace.name}`,
        onClick: () => onSelectWorkspace(namedWorkspace),
      },
    };
  }

  // 1. Cheapest workspace
  if (q.includes('cheapest') || q.includes('lowest') || q.includes('least expensive')) {
    const cheapest = [...WORKSPACES].sort((a, b) => a.rentPerDay - b.rentPerDay)[0];
    return {
      text: `The most affordable option is **${cheapest.name}** in ${cheapest.location} at **₹${cheapest.rentPerDay}/day**. It features a peaceful quiet zone and high-speed Wi-Fi.`,
      workspaceCards: [cheapest],
      suggestedAction: {
        label: `View ${cheapest.name}`,
        onClick: () => onSelectWorkspace(cheapest),
      },
    };
  }

  // 2. Spaces under 500
  if (
    q.includes('under 500') ||
    q.includes('under ₹500') ||
    q.includes('under rs 500') ||
    q.includes('less than 500') ||
    q.includes('below 500')
  ) {
    const affordable = WORKSPACES.filter((w) => w.rentPerDay <= 500);
    return {
      text: `We feature ${affordable.length} spaces under ₹500 per day:\n• **The Sunlit Atelier** (₹499/day) in Jubilee Hills\n• **Velvet Study House** (₹449/day) in Madhapur`,
      workspaceCards: affordable,
    };
  }

  // 3. Creative spaces
  if (q.includes('creative') || q.includes('studio') || q.includes('art')) {
    const creative = WORKSPACES.filter(
      (w) => w.type.toLowerCase().includes('creative') || w.type.toLowerCase().includes('collaborative')
    );
    return {
      text: `Here are our inspiring creative hubs with abundant natural light and design-first atmospheres:`,
      workspaceCards: creative,
      suggestedAction: {
        label: 'Filter by Creative Spaces',
        onClick: () => {
          onApplyFilter('Creative');
          const el = document.getElementById('workspaces');
          el?.scrollIntoView({ behavior: 'smooth' });
        },
      },
    };
  }

  // 4. Quiet workspaces
  if (q.includes('quiet') || q.includes('focus') || q.includes('study') || q.includes('peaceful')) {
    const quiet = WORKSPACES.filter(
      (w) => w.type.toLowerCase().includes('quiet') || w.amenities.some((a) => a.toLowerCase().includes('quiet'))
    );
    return {
      text: `For deep focus and minimal distractions, **Velvet Study House** in Madhapur is equipped with dedicated quiet zones and ergonomic workstations.`,
      workspaceCards: quiet,
      suggestedAction: {
        label: 'Filter by Quiet Spaces',
        onClick: () => {
          onApplyFilter('Quiet');
          const el = document.getElementById('workspaces');
          el?.scrollIntoView({ behavior: 'smooth' });
        },
      },
    };
  }

  // 5. Can I save a workspace? / Saved spaces
  if (
    q.includes('can i save') ||
    q.includes('how to save') ||
    q.includes('how do i save') ||
    q.includes('save a workspace')
  ) {
    return {
      text: "Yes, you can easily save any workspace! Tap the heart icon on any workspace card or in the quick preview bottom sheet to save it to your local favorites. You can view all saved spaces anytime using the 'Saved' filter chip or tapping the 'Saved' navigation tab.",
      suggestedAction: {
        label: 'View Saved Spaces',
        onClick: () => {
          onApplyFilter('Saved');
          const el = document.getElementById('workspaces');
          el?.scrollIntoView({ behavior: 'smooth' });
        },
      },
    };
  }

  if (q.includes('saved') || q.includes('favorite')) {
    const savedList = WORKSPACES.filter((w) => isFavorite(w.id));
    if (savedList.length === 0) {
      return {
        text: "You haven't saved any workspaces yet. Tap the heart icon on any card to save it for your day.",
      };
    }
    return {
      text: `You have saved ${savedList.length} space${savedList.length > 1 ? 's' : ''}:`,
      workspaceCards: savedList,
      suggestedAction: {
        label: 'Show My Saved Spaces',
        onClick: () => {
          onApplyFilter('Saved');
          const el = document.getElementById('workspaces');
          el?.scrollIntoView({ behavior: 'smooth' });
        },
      },
    };
  }

  // 6. What is Deskora?
  if (q === 'deskora' || q.includes('what is deskora') || q.includes('about deskora')) {
    return {
      text: "Deskora is a mobile-first discovery platform for curated boutique workspaces across Hyderabad. It brings together quiet study nooks, sunlit ateliers, and inspiring design studios with transparent daily pass rates (₹449 to ₹699) and zero recurring membership fees.",
    };
  }

  // 7. What is a workspace?
  if (q.includes('what is a workspace') || q.includes('define workspace')) {
    return {
      text: "In Deskora, a workspace represents a verified boutique work environment — such as a creative atelier, quiet study house, or botanical loft — equipped with high-speed Wi-Fi, power backup, and comfortable desks.",
    };
  }

  // 8. Cost & rent
  if (q.includes('cost') || q.includes('price') || q.includes('rent') || q.includes('how much') || q.includes('rate')) {
    return {
      text: "Day passes range from ₹449 to ₹699 per day across Hyderabad. Every rate is 100% transparent with zero recurring membership dues or hidden security deposits.",
    };
  }

  // 9. Locations / Where are workspaces?
  if (q.includes('where') || q.includes('location') || q.includes('city') || q.includes('hyderabad')) {
    return {
      text: "All 5 curated workspaces are situated in prime hubs of Hyderabad: Jubilee Hills, Banjara Hills, Madhapur, Gachibowli, and Hitech City.",
    };
  }

  // 10. How does Book Desk work? / Is payment available?
  if (q.includes('is payment') || q.includes('payment available') || q.includes('pay')) {
    return {
      text: "No real payment or credit card processing is active. Deskora is a client-side prototype created for this screening evaluation. All reservation interactions are realistic UI simulations with zero financial transactions.",
    };
  }

  if (q.includes('book') || q.includes('reserve') || q.includes('booking')) {
    return {
      text: "Tapping 'Day Pass' or 'Book Desk' opens a realistic UI confirmation simulation tailored for this candidate screening demo. You can view verified amenities, daily pass inclusions, and simulate pass confirmation without needing a credit card or processing live transactions.",
    };
  }

  // 11. Login required?
  if (q.includes('login') || q.includes('auth') || q.includes('account')) {
    return {
      text: "No login is required! You can freely browse, filter, search, preview, and save favorites in your local browser session without creating an account.",
    };
  }

  // 12. Rating explanation
  if (q.includes('rating') || q.includes('review') || q.includes('stars')) {
    return {
      text: "Deskora ratings range from 4.7 to 4.9 stars based on verified guest feedback evaluating quietness, Wi-Fi stability, natural lighting, and ergonomic comfort.",
    };
  }

  // 13. Mobile support
  if (q.includes('mobile') || q.includes('phone') || q.includes('tablet')) {
    return {
      text: "Deskora is mobile-first, designed with smooth native-style bottom sheets, large 44px+ touch targets, and full responsiveness from 320px screens upwards.",
    };
  }

  // Default fallback searching workspace terms
  const matches = WORKSPACES.filter(
    (w) =>
      w.name.toLowerCase().includes(q) ||
      w.location.toLowerCase().includes(q) ||
      w.amenities.some((a) => a.toLowerCase().includes(q))
  );

  if (matches.length > 0) {
    return {
      text: `I found ${matches.length} matching space${matches.length > 1 ? 's' : ''} for "${query}":`,
      workspaceCards: matches,
    };
  }

  return {
    text: `I'm tuned to answer questions about Deskora's 5 workspaces, amenities, locations in Hyderabad, and daily pricing (₹449–₹699). Try asking "What is the cheapest workspace?", "How much is Maison Botanica?", or "Which spaces are under ₹500?"!`,
  };
}

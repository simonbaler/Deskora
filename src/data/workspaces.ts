/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workspace } from '../types';

/**
 * Curated list of exactly 5 fake workspaces satisfying Task 3 Screening requirement.
 * Hardcoded data with dummy workspace photography, rent amount in INR, and location.
 */
export const WORKSPACES: Workspace[] = [
  {
    id: 'deskora-001',
    name: 'The Sunlit Atelier',
    location: 'Jubilee Hills, Hyderabad',
    rentPerDay: 499,
    rating: 4.9,
    type: 'Creative Workspace',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    description: 'A bright, calm workspace designed for focused work and creative sessions.',
    amenities: ['High-speed WiFi', 'AC', 'Power Backup'],
    vibe: 'Warm & Inspiring',
  },
  {
    id: 'deskora-002',
    name: 'Maison Botanica',
    location: 'Banjara Hills, Hyderabad',
    rentPerDay: 599,
    rating: 4.8,
    type: 'Premium Desk',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    description: 'A warm workspace surrounded by natural light and greenery.',
    amenities: ['WiFi', 'Coffee', 'Meeting Room'],
    vibe: 'Greenery & Light',
  },
  {
    id: 'deskora-003',
    name: 'Velvet Study House',
    location: 'Madhapur, Hyderabad',
    rentPerDay: 449,
    rating: 4.7,
    type: 'Quiet Workspace',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    description: 'A peaceful environment for deep focus and uninterrupted work.',
    amenities: ['Quiet Zone', 'WiFi', 'AC'],
    vibe: 'Deep Quiet Nook',
  },
  {
    id: 'deskora-004',
    name: 'The Glasshouse Collective',
    location: 'Gachibowli, Hyderabad',
    rentPerDay: 699,
    rating: 4.9,
    type: 'Collaborative Space',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    description: 'A modern collaborative workspace with an open and inspiring atmosphere.',
    amenities: ['Meeting Room', 'WiFi', 'Power Backup'],
    vibe: 'Modern Collaborative',
  },
  {
    id: 'deskora-005',
    name: 'Kissa Corner Studio',
    location: 'Hitech City, Hyderabad',
    rentPerDay: 549,
    rating: 4.8,
    type: 'Private Desk',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
    description: 'A cozy private workspace for focused work and personal projects.',
    amenities: ['Private Desk', 'WiFi', 'Coffee'],
    vibe: 'Boutique Focus',
  },
];

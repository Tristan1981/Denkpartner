import React from 'react';
import { PricingItem, EducationItem } from './types';

export const NAVIGATION_LINKS = [
  { name: 'Jij', href: '#jij' },
  { name: 'Wij', href: '#wij' },
  { name: 'Ik', href: '#ik' },
  { name: 'Resultaten', href: '#resultaten' },
  { name: 'Aanbod', href: '#aanbod' },
  { name: 'Over mij', href: '#over-mij' },
  { name: 'Contact', href: '#contact' },
];

export const PRICING_DATA: PricingItem[] = [
  {
    title: 'Intakegesprek',
    price: '€250,-',
    description: 'Een eerste verdieping in waar je staat en wat er nodig is.',
    subtext: 'Wordt verrekend wanneer we een traject starten.'
  },
  {
    title: 'Los gesprek (2 uur)',
    price: '€650,-',
    description: 'Voor leiders met een urgente vraag of thema dat diepte vraagt.'
  },
  {
    title: 'Kort traject (3–6 maanden)',
    price: 'Prijs op aanvraag',
    description: 'Gerichte begeleiding naar helderheid, richting en betekenis.'
  },
  {
    title: 'Intensief traject (6–12 maanden)',
    price: 'Prijs op aanvraag',
    description: 'Voor leiders die structureel willen leven en leiden vanuit hun kern.'
  },
  {
    title: 'Partner traject (12+ maanden)',
    price: 'Prijs op aanvraag',
    description: 'Mijn meest exclusieve vorm van samenwerking: maximale nabijheid, prioriteit en directe bereikbaarheid.'
  },
  {
    title: 'Groepstraining Intern Leiderschap',
    price: '€950,-',
    description: '1,5 dag. Diep, eerlijk en inzichtgevend in kleine groepen.'
  },
  {
    title: 'Presentatietraining',
    price: '€1.250,-',
    description: '2 dagen. Voor leiders die hun verhaal helder, krachtig en authentiek willen neerzetten, met minimale spreekangst.'
  },
  {
    title: 'Incompany / maatwerk',
    price: 'Prijs op aanvraag',
    description: 'Voor teams en organisaties.'
  }
];

export const EDUCATION_DATA: EducationItem[] = [
  { year: '2025–heden', title: 'Master Spiritual Care', institution: 'Rijksuniversiteit Groningen' },
  { year: '2025', title: 'Trainersopleiding', institution: 'Unbreakable Academy' },
  { year: '2023–2025', title: 'Special Forces-trainingsprogramma’s', institution: 'Unbreakable Academy' },
  { year: '2016–2017', title: 'Opleiding Mind Tuning Coach', institution: 'Frijters Mind Tuning' },
  { year: '2016–2017', title: 'Opleiding Spreektrainer', institution: 'Spreek.nl' },
  { year: '2013–2015', title: 'Opleiding Mental Coach', institution: 'Instituut voor Mental Coaching (Löhnen)' },
  { year: '2004–2020', title: 'Systema seminars & opleidingen binnen- en buitenland', institution: '' },
  { year: '2010–2013', title: 'Registercontroller', institution: 'Rijksuniversiteit Groningen' },
  { year: '2002–2006', title: 'Hospitality / Facility Management', institution: '' },
];

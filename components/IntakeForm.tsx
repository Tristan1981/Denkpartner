import React, { useState } from 'react';
import { Button } from './Button';
import { FormData } from '../types';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

export const IntakeForm: React.FC = () => {
  const [showIntake, setShowIntake] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    contactMethod: 'email',
    message: '',
    investmentUnderstanding: false,
    intakeQ1: '',
    intakeQ2: '',
    intakeQ3: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const encode = (data: any) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.investmentUnderstanding) {
      alert("Bevestig alstublieft dat u begrijpt dat dit een investering vereist.");
      return;
    }
    setLoading(true);
    
    // We versturen de gegevens via Formsubmit.co direct naar Tristanwiering@gmail.com
    fetch("https://formsubmit.co/ajax/Tristanwiering@gmail.com", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        _subject: `Nieuwe Intake / Contactaanvraag van ${formData.name}`,
        _template: "table",
        naam: formData.name,
        email: formData.email,
        telefoon: formData.phone || 'Niet ingevuld',
        voorkeur_contact: formData.contactMethod,
        organisatie: formData.organization || 'Niet ingevuld',
        functie_rol: formData.role || 'Niet ingevuld',
        bericht: formData.message || 'Geen bericht',
        intake_vraag_1_waar_sta_je: formData.intakeQ1 || 'Niet ingevuld',
        intake_vraag_2_wat_schuurt_er: formData.intakeQ2 || 'Niet ingevuld',
        intake_vraag_3_wat_zou_er_anders_zijn: formData.intakeQ3 || 'Niet ingevuld',
        investering_akkoord: formData.investmentUnderstanding ? 'Ja' : 'Nee'
      })
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        setSubmitted(true);
      })
      .catch(error => {
        console.error("Formsubmit error, fallback to mailto", error);
        // Fallback naar mailto als er een netwerkfout is
        const subject = encodeURIComponent(`Intake/Contactaanvraag van ${formData.name}`);
        const body = encodeURIComponent(
          `Naam: ${formData.name}\n` +
          `E-mail: ${formData.email}\n` +
          `Telefoon: ${formData.phone || 'Niet ingevuld'}\n` +
          `Voorkeur Contact: ${formData.contactMethod}\n` +
          `Organisatie: ${formData.organization || 'Niet ingevuld'}\n` +
          `Functie / Rol: ${formData.role || 'Niet ingevuld'}\n\n` +
          `Bericht:\n${formData.message || 'Geen bericht'}\n\n` +
          `Intake Vragen:\n` +
          `1. Waar sta je nu?\n${formData.intakeQ1 || 'Niet ingevuld'}\n\n` +
          `2. Wat schuurt er?\n${formData.intakeQ2 || 'Niet ingevuld'}\n\n` +
          `3. Wat zou anders zijn?\n${formData.intakeQ3 || 'Niet ingevuld'}\n`
        );
        window.location.href = `mailto:Tristanwiering@gmail.com?subject=${subject}&body=${body}`;
        setLoading(false);
        setSubmitted(true);
      });
  };

  if (submitted) {
    return (
      <div className="bg-brand-black p-8 md:p-12 border border-brand-white text-center animate-fade-in">
        {/* Success Icon: Circle is Brand White (Black), Check is Brand Black (White) */}
        <div className="w-16 h-16 bg-brand-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="text-brand-black w-8 h-8" />
        </div>
        <h3 className="text-2xl font-serif mb-4 text-brand-white">Bedankt voor je bericht.</h3>
        <p className="text-brand-grey mb-6">
          Ik heb je gegevens in goede orde ontvangen. Ik neem binnen 48 uur contact met je op om te kijken of we een match zijn.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="secondary">Terug</Button>
      </div>
    );
  }

  return (
    <form 
      name="contact"
      onSubmit={handleSubmit} 
      className="bg-brand-black p-8 md:p-12 border border-brand-border space-y-6 shadow-2xl"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>Don't fill this out if you're human: <input name="bot-field" /></label>
      </p>
      <div className="space-y-2">
        <h3 className="text-2xl font-serif text-brand-white">Contact & Intake</h3>
        <p className="text-brand-grey text-sm">Vul onderstaand formulier in om een kennismaking te plannen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-brand-white">Naam *</label>
          <input 
            required 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-brand-border py-3 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder-brand-border"
            placeholder="Je volledige naam"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-brand-white">E-mail *</label>
          <input 
            required 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-brand-border py-3 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder-brand-border"
            placeholder="je@email.nl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-brand-white">Telefoon</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-brand-border py-3 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder-brand-border"
            placeholder="06 12345678"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-brand-white">Voorkeur Contact</label>
          <select 
            name="contactMethod" 
            value={formData.contactMethod}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-brand-border py-3 text-brand-white focus:outline-none focus:border-brand-white transition-colors [&>option]:bg-brand-black"
          >
            <option value="email">E-mail</option>
            <option value="phone">Telefonisch</option>
            <option value="whatsapp">Whatsapp</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-brand-white">Organisatie</label>
          <input 
            type="text" 
            name="organization" 
            value={formData.organization}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-brand-border py-3 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder-brand-border"
            placeholder="Bedrijfsnaam"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-brand-white">Functie / Rol</label>
          <input 
            type="text" 
            name="role" 
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-brand-border py-3 text-brand-white focus:outline-none focus:border-brand-white transition-colors placeholder-brand-border"
            placeholder="Bijv. CEO, DGA, Manager"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider text-brand-white">Bericht</label>
        <textarea 
          name="message" 
          value={formData.message}
          onChange={handleChange}
          rows={3}
          className="w-full bg-transparent border-b border-brand-border py-3 text-brand-white focus:outline-none focus:border-brand-white transition-colors resize-none placeholder-brand-border"
          placeholder="Waarmee kan ik je helpen?"
        />
      </div>

      {/* WEB APP FEATURE: COLLAPSIBLE INTAKE */}
      <div className="border border-brand-border rounded bg-brand-white/5 overflow-hidden">
        <button 
          type="button"
          onClick={() => setShowIntake(!showIntake)}
          className="w-full flex justify-between items-center p-4 text-left hover:bg-brand-border/10 transition-colors"
        >
          <span className="font-semibold text-brand-white flex items-center gap-2">
            <span className="bg-brand-white text-brand-black text-xs px-2 py-0.5 rounded font-bold">OPTIONEEL</span>
            Kennismaking voorbereiden (Intake)
          </span>
          {showIntake ? <ChevronUp className="w-5 h-5 text-brand-grey" /> : <ChevronDown className="w-5 h-5 text-brand-grey" />}
        </button>
        
        {showIntake && (
          <div className="p-6 space-y-6 border-t border-brand-border animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm text-brand-grey">Waar sta je nu in je leven/werk?</label>
              <textarea 
                name="intakeQ1"
                value={formData.intakeQ1}
                onChange={handleChange}
                className="w-full bg-brand-black border border-brand-border p-3 text-brand-white rounded focus:border-brand-white focus:outline-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-brand-grey">Wat schuurt er het meest op dit moment?</label>
              <textarea 
                name="intakeQ2"
                value={formData.intakeQ2}
                onChange={handleChange}
                className="w-full bg-brand-black border border-brand-border p-3 text-brand-white rounded focus:border-brand-white focus:outline-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-brand-grey">Wat zou er anders zijn in je leven als je dit hebt opgelost?</label>
              <textarea 
                name="intakeQ3"
                value={formData.intakeQ3}
                onChange={handleChange}
                className="w-full bg-brand-black border border-brand-border p-3 text-brand-white rounded focus:border-brand-white focus:outline-none"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 pt-4">
        <input 
          id="investment"
          type="checkbox"
          name="investmentUnderstanding"
          checked={formData.investmentUnderstanding}
          onChange={handleCheckboxChange}
          className="mt-1 w-5 h-5 border-brand-border bg-transparent text-brand-white focus:ring-brand-white accent-black"
        />
        <label htmlFor="investment" className="text-sm text-brand-grey cursor-pointer select-none">
          Ik begrijp dat dit een serieuze investering is in mijn ontwikkeling.
        </label>
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Versturen...' : 'Verstuur aanvraag'}
      </Button>
    </form>
  );
};
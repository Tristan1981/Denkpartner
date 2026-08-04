import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  MessageSquare, 
  ShoppingBag, 
  Settings, 
  BarChart3, 
  Search, 
  Bell, 
  LogOut,
  Plus,
  Edit3,
  Download,
  Trash2,
  ChevronRight,
  ExternalLink,
  Layout,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { Logo } from './Logo';

interface AdminDashboardProps {
  initialContent: any;
  onSave: (data: any) => Promise<void>;
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialContent, onSave, onExit }) => {
  const [activeTab, setActiveTab] = useState('content'); // Default to content as requested

  React.useEffect(() => {
    setActiveTab('content');
  }, []);
  
  // Local state for editing
  const [editData, setEditData] = useState(initialContent || {
    hero: { title: '', subtitle: '', intro: '', roles: [] },
    jij: { title: '', intro: '', p1: '', p2: '', p3: '', p4: '', quote: '', helderheid: '', meelopen: '' },
    wij: { title: '', subtitle: '', p1: '', p2: '', p3: '', p4: '', footer: '' },
    ik: { title: '', intro: '', rust_title: '', rust: '', ruimte_title: '', ruimte: '', richting_title: '', richting: '', p1: '', p2: '', quote: '' },
    resultaten: { title: '', footer: '', items: [] },
    aanbod: { title: '', intro: '' },
    overmij: { title: '', p1: '', p2: '', p3: '', p4: '', footer: '' },
    contact: { title: '', p1: '', p2: '', location: '' },
    pricing: [],
    education: [],
    navigation: [],
    theme: { fontSans: 'Inter', fontSerif: 'Playfair Display', baseFontSize: 16 },
    sections: [
      { id: 'jij', name: 'Jij', visible: true },
      { id: 'wij', name: 'Wij', visible: true },
      { id: 'ik', name: 'Ik', visible: true },
      { id: 'resultaten', name: 'Resultaten', visible: true },
      { id: 'aanbod', name: 'Aanbod', visible: true },
      { id: 'over-mij', name: 'Over mij', visible: true },
      { id: 'contact', name: 'Contact', visible: true }
    ]
  });

  const [isSaving, setIsSaving] = useState(false);

  // Update editData when initialContent changes
  React.useEffect(() => {
    if (initialContent) {
      setEditData(initialContent);
    }
  }, [initialContent]);

  const handleLocalSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editData);
      alert('Wijzigingen zijn succesvol opgeslagen in het CMS!');
    } catch (error) {
      alert('Er is een fout opgetreden bij het opslaan. Probeer het opnieuw.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadContentJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(editData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "content.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...(editData.sections || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    
    setEditData({ ...editData, sections: newSections });
  };

  const toggleSectionVisibility = (index: number) => {
    const newSections = [...(editData.sections || [])];
    newSections[index].visible = !newSections[index].visible;
    setEditData({ ...editData, sections: newSections });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center justify-center border-b border-slate-800">
          <Logo className="h-8 brightness-0 invert" />
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <SidebarItem icon={<Edit3 size={20} />} label="Website Content" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
          <SidebarItem icon={<Layout size={20} />} label="Website Indeling" active={activeTab === 'layout'} onClick={() => setActiveTab('layout')} />
          <SidebarItem icon={<Settings size={20} />} label="Vormgeving" active={activeTab === 'theme'} onClick={() => setActiveTab('theme')} />
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overzicht" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<MessageSquare size={20} />} label="Berichten & Chat" badge="3" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <SidebarItem icon={<Users size={20} />} label="CRM & Klanten" active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} />
          <SidebarItem icon={<Video size={20} />} label="Video Platform" active={activeTab === 'video'} onClick={() => setActiveTab('video')} />
          <SidebarItem icon={<ShoppingBag size={20} />} label="Bestellingen" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <SidebarItem icon={<BarChart3 size={20} />} label="Marketing & SEO" active={activeTab === 'marketing'} onClick={() => setActiveTab('marketing')} />
          <div className="pt-6 pb-2 px-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Systeem</div>
          <SidebarItem icon={<Settings size={20} />} label="Instellingen" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onExit || (() => window.location.reload())} className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors w-full px-3 py-2">
            <LogOut size={18} />
            <span>Uitloggen</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center text-gray-400 gap-2">
            <Search size={20} />
            <span className="text-sm">Zoeken in CMS...</span>
          </div>
          <div className="flex items-center gap-6">
            {activeTab === 'content' && (
              <button 
                onClick={handleLocalSave}
                disabled={isSaving}
                className={`${isSaving ? 'bg-gray-400' : 'bg-slate-900 hover:bg-slate-800'} text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-sm mr-4`}
              >
                {isSaving ? '...' : 'Snel Opslaan'}
              </button>
            )}
            <button className="relative text-gray-500 hover:text-slate-900">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-slate-900">Tristan Wiering</div>
                <div className="text-xs text-gray-500">Super Admin</div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                <img src="https://i.imgur.com/mUrRzIp.jpg" className="w-full h-full object-cover" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-500">Welkom terug, hier is je overzicht van vandaag.</p>
                </div>
                <button className="bg-brand-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
                  <Plus size={16} /> Nieuw Bericht
                </button>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="Omzet (Deze maand)" value="€ 12.450,-" trend="+12%" positive />
                <StatCard title="Nieuwe Leads" value="24" trend="+5%" positive />
                <StatCard title="Openstaande Chats" value="3" trend="Actie vereist" warning />
                <StatCard title="Video Views" value="1.2k" trend="+8%" positive />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RECENT ORDERS */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Recente Activiteit</h3>
                    <button className="text-sm text-brand-accent hover:text-brand-black">Bekijk alles</button>
                  </div>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-6 py-3">Klant</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Bedrag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <TableRow name="J. de Vries" type="Intakegesprek" status="Betaald" amount="€ 250,-" />
                      <TableRow name="S. Jansen" type="Video Cursus: Leiderschap" status="Betaald" amount="€ 49,-" />
                      <TableRow name="P. Bakker" type="Kort Traject" status="In behandeling" amount="€ 3.000,-" pending />
                      <TableRow name="M. Visser" type="Lead Magnet Download" status="Nieuw" amount="Gratis" />
                    </tbody>
                  </table>
                </div>

                {/* UPCOMING APPOINTMENTS */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Agenda Vandaag</h3>
                  <div className="space-y-4">
                    <AppointmentItem time="09:00" title="Intakegesprek" name="Karel Martens" />
                    <AppointmentItem time="13:30" title="Coaching Sessie 3/5" name="Linda de Jong" />
                    <AppointmentItem time="15:00" title="Video Opname" name="Intern" type="internal" />
                  </div>
                  <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Synchroniseer Agenda
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'theme' && (
            <div className="max-w-4xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Vormgeving</h1>
                  <p className="text-gray-500">Pas de lettertypes en tekstgrootte van je website aan.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={downloadContentJson}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                    title="Download alleen het tekstbestand voor GitHub"
                  >
                    <Download size={18} />
                    Download content.json
                  </button>
                  <button 
                    onClick={handleLocalSave}
                    disabled={isSaving}
                    className={`${isSaving ? 'bg-gray-400' : 'bg-slate-900 hover:bg-slate-800'} text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg`}
                  >
                    {isSaving ? 'Opslaan...' : 'Wijzigingen Opslaan'}
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-6 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    Lettertypes (Google Fonts)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Basis Lettertype (Sans-serif)</label>
                      <p className="text-xs text-gray-500 mb-3">Gebruikt voor de meeste teksten en knoppen.</p>
                      <select 
                        value={editData.theme?.fontSans || 'Inter'}
                        onChange={(e) => setEditData({...editData, theme: {...editData.theme, fontSans: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                      >
                        <option value="Inter">Inter (Standaard)</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Lato">Lato</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Space Grotesk">Space Grotesk</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Koppen Lettertype (Serif)</label>
                      <p className="text-xs text-gray-500 mb-3">Gebruikt voor titels, koppen en quotes.</p>
                      <select 
                        value={editData.theme?.fontSerif || 'Playfair Display'}
                        onChange={(e) => setEditData({...editData, theme: {...editData.theme, fontSerif: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                      >
                        <option value="Playfair Display">Playfair Display (Standaard)</option>
                        <option value="Lora">Lora</option>
                        <option value="Merriweather">Merriweather</option>
                        <option value="Libre Baskerville">Libre Baskerville</option>
                        <option value="Cormorant Garamond">Cormorant Garamond</option>
                        <option value="Georgia">Georgia</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-6 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    Tekstgrootte
                  </h2>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-bold text-gray-700">Basis Grootte: {editData.theme?.baseFontSize || 16}px</label>
                      <span className="text-xs text-gray-400">Standaard is 16px</span>
                    </div>
                    <input 
                      type="range" 
                      min="14" 
                      max="20" 
                      step="1"
                      value={editData.theme?.baseFontSize || 16}
                      onChange={(e) => setEditData({...editData, theme: {...editData.theme, baseFontSize: parseInt(e.target.value)}})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                    <div className="flex justify-between mt-2 text-[10px] text-gray-400 uppercase font-bold">
                      <span>Klein (14px)</span>
                      <span>Normaal (16px)</span>
                      <span>Groot (20px)</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <strong>Tip:</strong> Na het opslaan worden de nieuwe lettertypes direct geladen via Google Fonts. 
                    De "Basis Grootte" beïnvloedt alle teksten op de site proportioneel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="max-w-4xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Website Indeling</h1>
                  <p className="text-gray-500">Sleep de blokken of gebruik de pijlen om de volgorde van je website aan te passen.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={downloadContentJson}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Download size={18} />
                    Download content.json
                  </button>
                  <button 
                    onClick={handleLocalSave}
                    disabled={isSaving}
                    className={`${isSaving ? 'bg-gray-400' : 'bg-slate-900 hover:bg-slate-800'} text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg`}
                  >
                    {isSaving ? 'Opslaan...' : 'Volgorde Opslaan'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-12 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-6">Sectie Naam</div>
                  <div className="col-span-2 text-center">Zichtbaar</div>
                  <div className="col-span-3 text-center">Acties</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {(editData.sections || []).map((section: any, index: number) => (
                    <div key={section.id} className={`grid grid-cols-12 items-center p-4 hover:bg-gray-50 transition-colors ${!section.visible ? 'opacity-50' : ''}`}>
                      <div className="col-span-1 text-center font-mono text-gray-400">{index + 1}</div>
                      <div className="col-span-6">
                        <div className="font-bold text-gray-900">{section.name}</div>
                        <div className="text-xs text-gray-500">ID: {section.id}</div>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <button 
                          onClick={() => toggleSectionVisibility(index)}
                          className={`p-2 rounded-lg transition-colors ${section.visible ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          {section.visible ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                      <div className="col-span-3 flex justify-center gap-2">
                        <button 
                          onClick={() => moveSection(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-lg disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                        >
                          <ArrowUp size={20} />
                        </button>
                        <button 
                          onClick={() => moveSection(index, 'down')}
                          disabled={index === (editData.sections?.length || 0) - 1}
                          className="p-2 text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-lg disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                        >
                          <ArrowDown size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-xl flex gap-4">
                <div className="text-amber-600 shrink-0">
                  <Settings size={24} />
                </div>
                <div className="text-sm text-amber-800 leading-relaxed">
                  <strong>Let op:</strong> De volgorde die je hier instelt bepaalt hoe de website van boven naar beneden wordt opgebouwd. 
                  De "Hero" (bovenaan) en de "Footer" (onderaan) staan vast, maar alles daartussen kun je vrij verschuiven.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="max-w-4xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Website Content</h1>
                  <p className="text-gray-500">Pas de teksten op je homepage aan.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={downloadContentJson}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                    title="Download alleen het tekstbestand voor GitHub"
                  >
                    <Download size={18} />
                    Download content.json
                  </button>
                  <button 
                    onClick={handleLocalSave}
                    disabled={isSaving}
                    className={`${isSaving ? 'bg-gray-400' : 'bg-slate-900 hover:bg-slate-800'} text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Opslaan...
                      </>
                    ) : 'Wijzigingen Opslaan'}
                  </button>
                </div>
              </div>

              <div className="space-y-8 pb-20">
                {/* NAVIGATION SECTION */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    Navigatie Menu
                  </h2>
                  <div className="space-y-4">
                    {editData.navigation.map((link: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Naam</label>
                          <input 
                            type="text" 
                            value={link.name}
                            onChange={(e) => {
                              const newNav = [...editData.navigation];
                              newNav[idx] = { ...link, name: e.target.value };
                              setEditData({ ...editData, navigation: newNav });
                            }}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Link (href)</label>
                          <input 
                            type="text" 
                            value={link.href}
                            onChange={(e) => {
                              const newNav = [...editData.navigation];
                              newNav[idx] = { ...link, href: e.target.value };
                              setEditData({ ...editData, navigation: newNav });
                            }}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HERO SECTION */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    Hero Sectie
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Hero Titel</label>
                      <input 
                        type="text" 
                        value={editData.hero.title}
                        onChange={(e) => setEditData({...editData, hero: {...editData.hero, title: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Hero Subtitel</label>
                      <textarea 
                        rows={3}
                        value={editData.hero.subtitle}
                        onChange={(e) => setEditData({...editData, hero: {...editData.hero, subtitle: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Hero Introductie</label>
                      <textarea 
                        rows={4}
                        value={editData.hero.intro}
                        onChange={(e) => setEditData({...editData, hero: {...editData.hero, intro: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Rollen (komma gescheiden)</label>
                      <input 
                        type="text" 
                        value={editData.hero.roles.join(', ')}
                        onChange={(e) => setEditData({...editData, hero: {...editData.hero, roles: e.target.value.split(',').map(s => s.trim())}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* JIJ SECTION */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    JIJ Sectie
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Sectie Titel</label>
                      <input 
                        type="text" 
                        value={editData.jij.title}
                        onChange={(e) => setEditData({...editData, jij: {...editData.jij, title: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Introductie (Vetgedrukt)</label>
                      <textarea 
                        rows={3}
                        value={editData.jij.intro}
                        onChange={(e) => setEditData({...editData, jij: {...editData.jij, intro: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 1</label>
                        <textarea 
                          rows={3}
                          value={editData.jij.p1}
                          onChange={(e) => setEditData({...editData, jij: {...editData.jij, p1: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 2</label>
                        <textarea 
                          rows={3}
                          value={editData.jij.p2}
                          onChange={(e) => setEditData({...editData, jij: {...editData.jij, p2: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 3</label>
                        <textarea 
                          rows={3}
                          value={editData.jij.p3}
                          onChange={(e) => setEditData({...editData, jij: {...editData.jij, p3: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 4</label>
                        <textarea 
                          rows={3}
                          value={editData.jij.p4}
                          onChange={(e) => setEditData({...editData, jij: {...editData.jij, p4: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Quote (In zwart blok)</label>
                      <textarea 
                        rows={3}
                        value={editData.jij.quote}
                        onChange={(e) => setEditData({...editData, jij: {...editData.jij, quote: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Helderheid Tekst</label>
                        <input 
                          type="text" 
                          value={editData.jij.helderheid}
                          onChange={(e) => setEditData({...editData, jij: {...editData.jij, helderheid: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Meelopen Tekst</label>
                        <input 
                          type="text" 
                          value={editData.jij.meelopen}
                          onChange={(e) => setEditData({...editData, jij: {...editData.jij, meelopen: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* WIJ SECTION */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    WIJ Sectie
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Sectie Titel</label>
                        <input 
                          type="text" 
                          value={editData.wij.title}
                          onChange={(e) => setEditData({...editData, wij: {...editData.wij, title: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Subtitel (Serif)</label>
                        <input 
                          type="text" 
                          value={editData.wij.subtitle}
                          onChange={(e) => setEditData({...editData, wij: {...editData.wij, subtitle: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 1</label>
                        <textarea 
                          rows={3}
                          value={editData.wij.p1}
                          onChange={(e) => setEditData({...editData, wij: {...editData.wij, p1: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 2</label>
                        <textarea 
                          rows={3}
                          value={editData.wij.p2}
                          onChange={(e) => setEditData({...editData, wij: {...editData.wij, p2: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 3</label>
                        <textarea 
                          rows={3}
                          value={editData.wij.p3}
                          onChange={(e) => setEditData({...editData, wij: {...editData.wij, p3: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 4</label>
                        <textarea 
                          rows={3}
                          value={editData.wij.p4}
                          onChange={(e) => setEditData({...editData, wij: {...editData.wij, p4: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Footer Tekst (Vetgedrukt)</label>
                      <textarea 
                        rows={2}
                        value={editData.wij.footer}
                        onChange={(e) => setEditData({...editData, wij: {...editData.wij, footer: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* IK SECTION */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    IK Sectie
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Sectie Titel</label>
                      <input 
                        type="text" 
                        value={editData.ik.title}
                        onChange={(e) => setEditData({...editData, ik: {...editData.ik, title: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Introductie</label>
                      <textarea 
                        rows={2}
                        value={editData.ik.intro}
                        onChange={(e) => setEditData({...editData, ik: {...editData.ik, intro: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Rust Titel</label>
                        <input 
                          type="text" 
                          value={editData.ik.rust_title}
                          onChange={(e) => setEditData({...editData, ik: {...editData.ik, rust_title: e.target.value}})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mb-2"
                        />
                        <label className="block text-xs font-bold text-gray-700 mb-1">Rust Tekst</label>
                        <input 
                          type="text" 
                          value={editData.ik.rust}
                          onChange={(e) => setEditData({...editData, ik: {...editData.ik, rust: e.target.value}})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Ruimte Titel</label>
                        <input 
                          type="text" 
                          value={editData.ik.ruimte_title}
                          onChange={(e) => setEditData({...editData, ik: {...editData.ik, ruimte_title: e.target.value}})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mb-2"
                        />
                        <label className="block text-xs font-bold text-gray-700 mb-1">Ruimte Tekst</label>
                        <input 
                          type="text" 
                          value={editData.ik.ruimte}
                          onChange={(e) => setEditData({...editData, ik: {...editData.ik, ruimte: e.target.value}})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Richting Titel</label>
                        <input 
                          type="text" 
                          value={editData.ik.richting_title}
                          onChange={(e) => setEditData({...editData, ik: {...editData.ik, richting_title: e.target.value}})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mb-2"
                        />
                        <label className="block text-xs font-bold text-gray-700 mb-1">Richting Tekst</label>
                        <input 
                          type="text" 
                          value={editData.ik.richting}
                          onChange={(e) => setEditData({...editData, ik: {...editData.ik, richting: e.target.value}})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 1</label>
                        <textarea 
                          rows={3}
                          value={editData.ik.p1}
                          onChange={(e) => setEditData({...editData, ik: {...editData.ik, p1: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 2</label>
                        <textarea 
                          rows={3}
                          value={editData.ik.p2}
                          onChange={(e) => setEditData({...editData, ik: {...editData.ik, p2: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Quote (Serif Italic)</label>
                      <textarea 
                        rows={3}
                        value={editData.ik.quote}
                        onChange={(e) => setEditData({...editData, ik: {...editData.ik, quote: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* RESULTATEN SECTION */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    Resultaten Sectie
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Sectie Titel</label>
                      <input 
                        type="text" 
                        value={editData.resultaten.title}
                        onChange={(e) => setEditData({...editData, resultaten: {...editData.resultaten, title: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Footer Tekst</label>
                      <textarea 
                        rows={2}
                        value={editData.resultaten.footer}
                        onChange={(e) => setEditData({...editData, resultaten: {...editData.resultaten, footer: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Resultaten Lijst (één per regel)</label>
                      <textarea 
                        rows={6}
                        value={editData.resultaten.items.join('\n')}
                        onChange={(e) => setEditData({...editData, resultaten: {...editData.resultaten, items: e.target.value.split('\n')}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* AANBOD SECTION */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    Aanbod Sectie
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Sectie Titel</label>
                      <input 
                        type="text" 
                        value={editData.aanbod.title}
                        onChange={(e) => setEditData({...editData, aanbod: {...editData.aanbod, title: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Introductie</label>
                      <textarea 
                        rows={3}
                        value={editData.aanbod.intro}
                        onChange={(e) => setEditData({...editData, aanbod: {...editData.aanbod, intro: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* PRICING ITEMS */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    Prijzen (Aanbod Items)
                  </h2>
                  <div className="space-y-6">
                    {editData.pricing.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 border border-gray-100 rounded-lg bg-gray-50 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-400 uppercase">Item #{idx + 1}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Titel</label>
                            <input 
                              type="text" 
                              value={item.title}
                              onChange={(e) => {
                                const newPricing = [...editData.pricing];
                                newPricing[idx] = { ...item, title: e.target.value };
                                setEditData({ ...editData, pricing: newPricing });
                              }}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Prijs</label>
                            <input 
                              type="text" 
                              value={item.price}
                              onChange={(e) => {
                                const newPricing = [...editData.pricing];
                                newPricing[idx] = { ...item, price: e.target.value };
                                setEditData({ ...editData, pricing: newPricing });
                              }}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Beschrijving</label>
                          <textarea 
                            rows={2}
                            value={item.description}
                            onChange={(e) => {
                              const newPricing = [...editData.pricing];
                              newPricing[idx] = { ...item, description: e.target.value };
                              setEditData({ ...editData, pricing: newPricing });
                            }}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        {item.subtext !== undefined && (
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Subtekst (optioneel)</label>
                            <input 
                              type="text" 
                              value={item.subtext}
                              onChange={(e) => {
                                const newPricing = [...editData.pricing];
                                newPricing[idx] = { ...item, subtext: e.target.value };
                                setEditData({ ...editData, pricing: newPricing });
                              }}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* EDUCATION SECTION */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    Opleidingen
                  </h2>
                  <div className="space-y-4">
                    {editData.education.map((edu: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-3">
                          <label className="block text-xs font-bold text-gray-700 mb-1">Jaar</label>
                          <input 
                            type="text" 
                            value={edu.year}
                            onChange={(e) => {
                              const newEdu = [...editData.education];
                              newEdu[idx] = { ...edu, year: e.target.value };
                              setEditData({ ...editData, education: newEdu });
                            }}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="col-span-5">
                          <label className="block text-xs font-bold text-gray-700 mb-1">Titel</label>
                          <input 
                            type="text" 
                            value={edu.title}
                            onChange={(e) => {
                              const newEdu = [...editData.education];
                              newEdu[idx] = { ...edu, title: e.target.value };
                              setEditData({ ...editData, education: newEdu });
                            }}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="col-span-4">
                          <label className="block text-xs font-bold text-gray-700 mb-1">Instituut</label>
                          <input 
                            type="text" 
                            value={edu.institution}
                            onChange={(e) => {
                              const newEdu = [...editData.education];
                              newEdu[idx] = { ...edu, institution: e.target.value };
                              setEditData({ ...editData, education: newEdu });
                            }}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* OVER MIJ SECTION */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    Over Mij Sectie
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Sectie Titel</label>
                      <input 
                        type="text" 
                        value={editData.overmij.title}
                        onChange={(e) => setEditData({...editData, overmij: {...editData.overmij, title: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 1</label>
                        <textarea 
                          rows={3}
                          value={editData.overmij.p1}
                          onChange={(e) => setEditData({...editData, overmij: {...editData.overmij, p1: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 2</label>
                        <textarea 
                          rows={3}
                          value={editData.overmij.p2}
                          onChange={(e) => setEditData({...editData, overmij: {...editData.overmij, p2: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 3</label>
                        <textarea 
                          rows={3}
                          value={editData.overmij.p3}
                          onChange={(e) => setEditData({...editData, overmij: {...editData.overmij, p3: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Paragraaf 4</label>
                        <textarea 
                          rows={3}
                          value={editData.overmij.p4}
                          onChange={(e) => setEditData({...editData, overmij: {...editData.overmij, p4: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Footer Tekst (Serif Italic)</label>
                      <input 
                        type="text" 
                        value={editData.overmij.footer}
                        onChange={(e) => setEditData({...editData, overmij: {...editData.overmij, footer: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* CONTACT SECTION */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                    <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
                    Contact Sectie
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Sectie Titel</label>
                      <input 
                        type="text" 
                        value={editData.contact.title}
                        onChange={(e) => setEditData({...editData, contact: {...editData.contact, title: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Introductie (Paragraaf 1)</label>
                        <textarea 
                          rows={3}
                          value={editData.contact.p1}
                          onChange={(e) => setEditData({...editData, contact: {...editData.contact, p1: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Extra Tekst (Paragraaf 2)</label>
                        <textarea 
                          rows={3}
                          value={editData.contact.p2}
                          onChange={(e) => setEditData({...editData, contact: {...editData.contact, p2: e.target.value}})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Locatie Tekst</label>
                      <input 
                        type="text" 
                        value={editData.contact.location}
                        onChange={(e) => setEditData({...editData, contact: {...editData.contact, location: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Klaar met aanpassen?</p>
                    <p className="text-xs text-slate-400">Vergeet niet je wijzigingen op te slaan.</p>
                  </div>
                  <button 
                    onClick={handleLocalSave}
                    disabled={isSaving}
                    className={`${isSaving ? 'bg-gray-400' : 'bg-slate-900 hover:bg-slate-800'} text-white px-8 py-3 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-md`}
                  >
                    {isSaving ? 'Bezig met opslaan...' : 'Nu Opslaan'}
                  </button>
                </div>

                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Status:</strong> Verbonden met de live back-end. Wijzigingen worden direct opgeslagen in content.json.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Berichten & Chat</h1>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Ongelezen Berichten</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="p-6 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold">Karel Martens</span>
                      <span className="text-xs text-gray-500">10:45</span>
                    </div>
                    <p className="text-sm text-gray-600">Ik heb een vraag over het intakegesprek van morgen...</p>
                  </div>
                  <div className="p-6 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold">Linda de Jong</span>
                      <span className="text-xs text-gray-500">Gisteren</span>
                    </div>
                    <p className="text-sm text-gray-600">Bedankt voor de sessie, het heeft me veel inzicht gegeven.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crm' && (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">CRM & Klanten</h1>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                      <th className="px-6 py-3">Naam</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Laatste Contact</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">Karel Martens</td>
                      <td className="px-6 py-4">k.martens@email.com</td>
                      <td className="px-6 py-4">Vandaag</td>
                      <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Actief</span></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">Linda de Jong</td>
                      <td className="px-6 py-4">linda@dejong.nl</td>
                      <td className="px-6 py-4">Gisteren</td>
                      <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Actief</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && activeTab !== 'content' && activeTab !== 'chat' && activeTab !== 'crm' && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="text-gray-400" size={40} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Module in ontwikkeling</h2>
              <p className="text-gray-500 max-w-xs mx-auto mt-2">
                De module <strong>{activeTab}</strong> is momenteel nog niet volledig geconfigureerd voor deze demo, maar de navigatie werkt nu wel!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper Components for Dashboard
const SidebarItem = ({ icon, label, active = false, badge, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      active 
        ? 'bg-white/10 text-white shadow-sm' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-white text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ title, value, trend, positive, warning }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h3 className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2">{title}</h3>
    <div className="flex items-end justify-between">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
        warning ? 'bg-orange-100 text-orange-700' :
        positive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {trend}
      </div>
    </div>
  </div>
);

const TableRow = ({ name, type, status, amount, pending }: any) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 font-medium text-gray-900">{name}</td>
    <td className="px-6 py-4 text-gray-500">{type}</td>
    <td className="px-6 py-4">
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        pending ? 'bg-yellow-100 text-yellow-800' : 
        amount === 'Gratis' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-gray-900">{amount}</td>
  </tr>
);

const AppointmentItem = ({ time, title, name, type }: any) => (
  <div className={`flex gap-4 p-3 rounded-lg border-l-4 ${type === 'internal' ? 'border-gray-300 bg-gray-50' : 'border-brand-black bg-blue-50/50'}`}>
    <div className="text-sm font-bold text-gray-900 w-12">{time}</div>
    <div>
      <div className="text-sm font-medium text-gray-900">{title}</div>
      <div className="text-xs text-gray-500">{name}</div>
    </div>
  </div>
);
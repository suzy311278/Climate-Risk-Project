import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { 
  Map, 
  BarChart3, 
  Wind, 
  ThermometerSun, 
  Droplets, 
  AlertTriangle, 
  ArrowRight, 
  Download, 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  LineChart,
  Layers,
  Mountain,
  Cpu,
  CheckCircle2,
  FileText,
  Database,
  Search,
  Calendar
} from 'lucide-react';

const ClimateRiskProject = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSampleTab, setActiveSampleTab] = useState('temperature');
  const [selectedRisk, setSelectedRisk] = useState('heat');
   const form = useRef();
   const [isSending, setIsSending] = useState(false);
   const [submitStatus, setSubmitStatus] = useState('');

   // EmailJS config via Vite env variables. Replace with your values in .env
   const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
   const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
   const EMAILJS_AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID || '';
   const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

   const sendEmail = (e) => {
      e.preventDefault();
      if (!form.current) return;
      setIsSending(true);
      setSubmitStatus('');
      // Fill hidden template fields so EmailJS can set Reply-To and From name
      let chosenQueryType = '';
      try {
        const f = form.current;
        const first = (f.elements['first_name'] && f.elements['first_name'].value) || '';
        const last = (f.elements['last_name'] && f.elements['last_name'].value) || '';
        const userEmail = (f.elements['user_email'] && f.elements['user_email'].value) || '';
        chosenQueryType = (f.elements['query_type'] && f.elements['query_type'].value) || '';
        if (f.elements['from_name']) f.elements['from_name'].value = `${first} ${last}`.trim();
        if (f.elements['reply_to']) f.elements['reply_to'].value = userEmail;
      } catch (err) {
        // ignore errors when reading form elements
      }

      // Send to admin
      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form.current, EMAILJS_PUBLIC_KEY)
         .then((result) => {
            setIsSending(false);
            setSubmitStatus(`Thanks — your ${chosenQueryType || 'request'} was sent. We will follow up shortly.`);
            // optional: reset form
            form.current.reset();
         })
         .catch((error) => {
            setIsSending(false);
            // Extract the most informative error message
            let errorMsg = 'Something went wrong';
            if (error.text) errorMsg = error.text;
            else if (error.message) errorMsg = error.message;
            else if (error.status) errorMsg = `Status ${error.status}`;
            
            setSubmitStatus(`❌ ${errorMsg}`);
            console.error('📧 EmailJS Error Details:');
            console.error('Message:', errorMsg);
            console.error('Status:', error.status);
            console.error('Full error:', error);
            console.error('Config - Service:', EMAILJS_SERVICE_ID);
            console.error('Config - Template:', EMAILJS_TEMPLATE_ID);
         });
   };

  // Data from index.html - Sample Tables
  const sampleData = {
    temperature: [
      { metric: "Average yearly temperature", present: "10.1 °C", l2050: "+1.3 °C", m2050: "+1.5 °C", h2050: "+2.1 °C", l2085: "+1.2 °C", m2085: "+2.1 °C", h2085: "+4.4 °C" },
      { metric: "Average summer temperature", present: "19.1 °C", l2050: "+1.4 °C", m2050: "+1.7 °C", h2050: "+2.2 °C", l2085: "+1.2 °C", m2085: "+2.3 °C", h2085: "+5.0 °C" },
      { metric: "Average winter temperature", present: "1.4 °C", l2050: "+1.5 °C", m2050: "+1.5 °C", h2050: "+2.4 °C", l2085: "+1.5 °C", m2085: "+2.1 °C", h2085: "+4.8 °C" },
      { metric: "Days max temp > 25°C", present: "35 days", l2050: "+15 days", m2050: "+17 days", h2050: "+24 days", l2085: "+11 days", m2085: "+24 days", h2085: "+55 days" },
      { metric: "Days max temp > 30°C", present: "6 days", l2050: "+6 days", m2050: "+9 days", h2050: "+12 days", l2085: "+6 days", m2085: "+11 days", h2085: "+32 days" },
    ],
    precipitation: [
      { metric: "Avg yearly total precipitation", present: "683 mm", l2050: "+30 mm", m2050: "+9 mm", h2050: "+26 mm", l2085: "+54 mm", m2085: "+31 mm", h2085: "+42 mm" },
      { metric: "Avg summer total precipitation", present: "214 mm", l2050: "+7 mm", m2050: "-10 mm", h2050: "-11 mm", l2085: "+10 mm", m2085: "+1 mm", h2085: "-28 mm" },
      { metric: "Days exceeding 10mm", present: "12 days", l2050: "+2 days", m2050: "+1 days", h2050: "+2 days", l2085: "+1 days", m2085: "+2 days", h2085: "+3 days" },
      { metric: "Dry days (<1mm)", present: "226 days", l2050: "-1 days", m2050: "+3 days", h2050: "+1 days", l2085: "-5 days", m2085: "+2 days", h2085: "+5 days" },
    ],
    flood: [
      { event: "10-year riverflood event", present: "1.6 m", l2030: "1/9 yr", m2030: "1/10 yr", h2030: "1/9 yr", l2040: "1/9 yr", m2040: "1/9 yr", h2040: "1/9 yr" },
      { event: "50-year riverflood event", present: "1.9 m", l2030: "1/47 yr", m2030: "1/48 yr", h2030: "1/47 yr", l2040: "1/46 yr", m2040: "1/45 yr", h2040: "1/43 yr" },
      { event: "100-year riverflood event", present: "2.0 m", l2030: "1/95 yr", m2030: "1/95 yr", h2030: "1/94 yr", l2040: "1/93 yr", m2040: "1/93 yr", h2040: "1/90 yr" },
    ]
  };

  // Mock Data for the Dashboard Sidebar
  const dashboardData = {
    heat: {
      level: 'High',
      trend: '+2.1°C',
      impact: 'Significant increase in cooling degree days (+516 °C days by 2085H). Heat stress critical.',
      regions: ['South Asia', 'Sub-Saharan Africa', 'Central America']
    },
    flood: {
      level: 'Moderate',
      trend: '+12%',
      impact: '1-in-100 year events increasing frequency to 1-in-90 years by 2040 under High emissions.',
      regions: ['Southeast Asia', 'Western Europe', 'US East Coast']
    },
    drought: {
      level: 'Critical',
      trend: '-20%',
      impact: 'Dry days (<1mm) increasing by +5 days/year by 2085. Agriculture yield risk high.',
      regions: ['Mediterranean', 'Southern Africa', 'Western USA']
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="font-sans text-slate-800 bg-white min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <Globe className="h-8 w-8 text-blue-400" />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-xl tracking-tight">ClimateRisk<span className="text-blue-400">Project</span></span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Asset Intelligence</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <button onClick={() => setActiveTab('home')} className={`hover:text-blue-400 transition ${activeTab === 'home' ? 'text-blue-400' : 'text-slate-300'}`}>Why Us</button>
              <button onClick={() => setActiveTab('samples')} className={`hover:text-blue-400 transition ${activeTab === 'samples' ? 'text-blue-400' : 'text-slate-300'}`}>Sample Data</button>
              <button onClick={() => setActiveTab('dashboard')} className={`hover:text-blue-400 transition ${activeTab === 'dashboard' ? 'text-blue-400' : 'text-slate-300'}`}>Data Platform</button>
              <a href="#contact" onClick={(e) => { e.preventDefault(); setActiveTab('home'); setTimeout(() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }), 100); }} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-md flex items-center gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-slate-300 hover:text-white">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => {setActiveTab('home'); toggleMenu()}} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 w-full text-left">Why Us</button>
              <button onClick={() => {setActiveTab('samples'); toggleMenu()}} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 w-full text-left">Sample Data</button>
              <button onClick={() => {setActiveTab('dashboard'); toggleMenu()}} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 w-full text-left">Data Platform</button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Switcher */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900" />
              
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <div className="inline-block mb-6 px-4 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-sm font-semibold uppercase tracking-wider">
                  Global Coverage · 1980-2100
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                  Turning Climate Complexity <br />into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Business Clarity</span>
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-xl text-slate-400">
                  Asset-level climate intelligence for organizations that need to plan, invest, and make decisions. We transform global climate science into clean, practical insights tailored to your exact locations.
                </p>
                
                {/* Hero Stats */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800 pt-8">
                   <div>
                      <div className="text-3xl font-bold text-white">45</div>
                      <div className="text-sm text-slate-400 mt-1">Years Historical Data<br/>(1980-2025)</div>
                   </div>
                   <div>
                      <div className="text-3xl font-bold text-white">2100</div>
                      <div className="text-sm text-slate-400 mt-1">Future Projections<br/>(2030-2100)</div>
                   </div>
                   <div>
                      <div className="text-3xl font-bold text-white">100+</div>
                      <div className="text-sm text-slate-400 mt-1">Climate Indicators<br/>Intensity & Frequency</div>
                   </div>
                   <div>
                      <div className="text-3xl font-bold text-white">900m</div>
                      <div className="text-sm text-slate-400 mt-1">Spatial Resolution<br/>Hyper-local precision</div>
                   </div>
                </div>

                <div className="mt-12 flex justify-center gap-4">
                  <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-lg shadow-lg shadow-blue-900/20 transition transform hover:-translate-y-1">
                    Request Climate Data
                  </button>
                  <button onClick={() => setActiveTab('samples')} className="px-8 py-4 bg-transparent border border-slate-600 hover:border-slate-400 rounded-lg font-semibold text-lg text-slate-300 transition">
                    View Sample Report
                  </button>
                </div>
              </div>
            </section>

            {/* Why Us Section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900">Why Climate Risk Project?</h2>
                  <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Climate data has traditionally been complex, coarse, and hard to apply. We built this platform to make it useful, defensible, and simple to integrate.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: <Map className="h-6 w-6 text-blue-600" />, title: "Actionable Data", desc: "Most tools give you blurry 10-25km grids. We give you asset-level clarity (~900m)." },
                    { icon: <ShieldCheck className="h-6 w-6 text-green-600" />, title: "Built for Decisions", desc: "Tailored for financial impact, compliance (TCFD, IFRS S2), and operational risk. No vague heatmaps." },
                    { icon: <Search className="h-6 w-6 text-orange-600" />, title: "100x More Detailed", desc: "Downscaling engineered for microclimates, local hazards, and site-specific extremes." },
                    { icon: <Database className="h-6 w-6 text-purple-600" />, title: "Data-Backed Ratings", desc: "Every rating is backed by climate statistics. Understand why, how, and when risk arises." },
                    { icon: <FileText className="h-6 w-6 text-teal-600" />, title: "Regulator Friendly", desc: "Insights designed for internal strategy, board communication, and regulatory filings." },
                    { icon: <Globe className="h-6 w-6 text-indigo-600" />, title: "Scientific Foundation", desc: "Powered by precise historical satellite data and CMIP6 model ensembles." }
                  ].map((feature, idx) => (
                    <div key={idx} className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100">
                      <div className="mb-4 p-3 bg-white rounded-lg shadow-sm inline-block">{feature.icon}</div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Our Data Split Section */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Your Climate Data, Structured for Business</h2>
                    <p className="mt-4 text-slate-600">We separate our analysis into two essential datasets: what has happened, and what could happen next.</p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-12">
                     {/* Historical */}
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase mb-6">
                           1980 – 2025
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Historical Climate</h3>
                        <p className="text-slate-600 mb-6">45 years of harmonised climate history, reconstructed at a precise downscaled resolution of ~900m.</p>
                        
                        <div className="space-y-4">
                           <h4 className="font-semibold text-slate-900 flex items-center gap-2"><Database className="h-4 w-4 text-blue-500"/> 100+ Indicators across:</h4>
                           <ul className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                              {['Heat & Temperature Extremes', 'Rainfall & Wet/Dry Spells', 'Extreme Events (Floods, Cyclones)', 'Humidity & Heat Stress', 'Runoff & Soil Moisture', 'Wind Behavior & Storms'].map((item, i) => (
                                 <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                                    {item}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>

                     {/* Future */}
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-bl-full -mr-12 -mt-12"></div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase mb-6 relative z-10">
                           2030 – 2100
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Future Climate Scenarios</h3>
                        <p className="text-slate-600 mb-6 relative z-10">Forward-looking projections built from multiple CMIP6 models, skill-weighted and downscaled.</p>
                        
                        <div className="space-y-4 relative z-10">
                           <h4 className="font-semibold text-slate-900 flex items-center gap-2"><LineChart className="h-4 w-4 text-orange-500"/> Flexible Projections:</h4>
                           <ul className="space-y-2 text-sm text-slate-700">
                              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500"/> Any timeframe (annual or decadal)</li>
                              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500"/> Any three scenarios (SSP1-2.6, SSP2-4.5, SSP5-8.5)</li>
                              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-orange-500"/> P5 – P95 percentile ranges & extreme event probabilities</li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* How We Build It */}
            <section className="py-20 bg-slate-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold">How We Build the Data</h2>
                  <p className="mt-4 text-slate-400">Scientific strength with practical clarity.</p>
                </div>
                
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                   {[
                      { icon: <Globe className="h-8 w-8 mx-auto mb-4 text-blue-400"/>, title: "Global Data", text: "Satellite hourly data & latest CMIP6 models." },
                      { icon: <Map className="h-8 w-8 mx-auto mb-4 text-blue-400"/>, title: "Downscaling", text: "Sharpening outputs to ~900m resolution." },
                      { icon: <Mountain className="h-8 w-8 mx-auto mb-4 text-blue-400"/>, title: "Topography", text: "Terrain factors improve realism." },
                      { icon: <Cpu className="h-8 w-8 mx-auto mb-4 text-blue-400"/>, title: "Machine Learning", text: "Bias correction & sub-grid coherence." },
                      { icon: <Search className="h-8 w-8 mx-auto mb-4 text-blue-400"/>, title: "Observation", text: "Anchored in observed weather stats." },
                      { icon: <CheckCircle2 className="h-8 w-8 mx-auto mb-4 text-blue-400"/>, title: "Validation", text: "Rigorous cross-validation for stability." },
                   ].map((step, i) => (
                      <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:bg-slate-800 transition">
                         {step.icon}
                         <h4 className="font-bold text-sm mb-2">{step.title}</h4>
                         <p className="text-xs text-slate-400">{step.text}</p>
                      </div>
                   ))}
                </div>
              </div>
            </section>

            {/* Intake & Deliverables */}
            <section className="py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
               {/* Advanced background elements */}
               <div className="absolute -left-40 -top-40 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
               <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
               <div className="absolute left-1/2 top-1/2 w-96 h-96 bg-purple-300/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  {/* Main heading */}
                  <div className="text-center mb-20">
                     <h2 className="text-5xl font-bold text-slate-900 mb-4">The Exchange<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">.</span></h2>
                     <p className="text-xl text-slate-600 max-w-2xl mx-auto">What you provide meets what you receive. Simple. Direct. Transformative.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-20 items-start">
                     {/* LEFT: INPUT */}
                     <div className="relative">
                        {/* Header */}
                        <div className="mb-16 relative">
                           <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
                              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                              <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Your Input</span>
                           </div>
                           <h3 className="text-4xl font-bold text-slate-900 leading-tight">What We<br/>Need From You</h3>
                        </div>

                        {/* Items */}
                        <div className="space-y-4 relative">
                           {/* Left side vertical accent */}
                           <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-blue-300 to-transparent rounded-full"></div>

                           {[
                              { icon: "📍", title: "Asset Locations", desc: "Latitude/Longitude coordinates for each site. We handle points, polygons, and complex multi-site portfolios across any geography." },
                              { icon: "📅", title: "Your Timeframes", desc: "Analysis windows from 2030s to 2085. Choose decadal averages or specific years depending on your planning horizon." },
                              { icon: "🎯", title: "Your Scenarios", desc: "Emission pathways (SSP1-2.6, SSP2-4.5, SSP5-8.5). Match your organization's climate policy and risk assumptions." }
                           ].map((item, i) => (
                              <div key={i} className="group">
                                 <div className="bg-white/70 backdrop-blur-sm hover:bg-white/100 rounded-xl p-6 border border-slate-200/60 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md cursor-default">
                                    <div className="flex gap-4">
                                       {/* Icon */}
                                       <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 border border-blue-100 group-hover:border-blue-300">
                                          {item.icon}
                                       </div>

                                       {/* Content */}
                                       <div className="flex-grow">
                                          <h4 className="text-lg font-bold text-slate-900 mb-1.5">{item.title}</h4>
                                          <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                       </div>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className="mt-3 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* CENTER: Arrow/Flow indicator */}
                     <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
                        <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-white border border-slate-200 shadow-lg">
                           <span className="text-slate-600 font-medium text-sm">Data In</span>
                           <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                           </svg>
                           <span className="text-slate-600 font-medium text-sm">Insights Out</span>
                        </div>
                     </div>

                     {/* RIGHT: OUTPUT */}
                     <div className="relative md:mt-8">
                        {/* Header */}
                        <div className="mb-16 relative">
                           <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/10 border border-slate-300 mb-6">
                              <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Your Output</span>
                           </div>
                           <h3 className="text-4xl font-bold text-slate-900 leading-tight">What You<br/>Receive</h3>
                        </div>

                        {/* Items */}
                        <div className="space-y-4 relative">
                           {/* Right side vertical accent */}
                           <div className="absolute -right-8 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-800 via-slate-600 to-transparent rounded-full"></div>

                           {[
                              { icon: "📊", title: "Historical Data Package", desc: "45 years of harmonized climate data (1980-2025) at ~900m resolution. Includes trends, anomalies, and baseline hazard metrics." },
                              { icon: "📈", title: "Scenario Analysis Pack", desc: "Multi-model CMIP6 ensemble outputs with P5/P50/P95 percentiles across all emission scenarios and timeframes." },
                              { icon: "📋", title: "Site-Specific Risk Report", desc: "Executive summary + detailed technical analysis. Formats: Excel, CSV, PDF, PPT, and JSON for seamless integration." }
                           ].map((item, i) => (
                              <div key={i} className="group">
                                 <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 hover:from-slate-900 hover:to-slate-800 backdrop-blur-sm rounded-xl p-6 border border-slate-700/60 hover:border-slate-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-default">
                                    <div className="flex gap-4">
                                       {/* Icon */}
                                       <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 border border-cyan-400/30 group-hover:border-cyan-400/60">
                                          {item.icon}
                                       </div>

                                       {/* Content */}
                                       <div className="flex-grow">
                                          <h4 className="text-lg font-bold text-white mb-1.5">{item.title}</h4>
                                          <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                                       </div>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className="mt-3 h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </section>

             {/* Pricing Section */}
             <section className="py-20 bg-slate-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                     <h2 className="text-3xl font-bold text-slate-900">Simple, Transparent Pricing</h2>
                     <p className="mt-4 text-slate-600">You own the data forever. Pay only for the sites you need.</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                     {/* Starter */}
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                        <div className="mb-4">
                           <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase">Starter</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">1 - 10 Sites</h3>
                        <div className="mt-6 mb-2">
                           <span className="text-4xl font-bold text-slate-900">$199</span>
                           <span className="text-slate-500">/site</span>
                        </div>
                        <div className="mb-6 text-sm text-slate-600">₹15,999 per site</div>
                        <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition mt-auto">Get Started</button>
                     </div>

                     {/* Popular */}
                     <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-600 flex flex-col transform md:-translate-y-4">
                        <div className="mb-4 flex justify-between items-start">
                           <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase">Popular</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">11 - 100 Sites</h3>
                        <div className="mt-6 mb-2">
                           <span className="text-4xl font-bold text-slate-900">$100</span>
                           <span className="text-slate-500">/site</span>
                        </div>
                        <div className="mb-6 text-sm text-slate-600">₹8,999 per site</div>
                        <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 mt-auto">Get Started</button>
                     </div>

                     {/* Enterprise */}
                     <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-700 flex flex-col text-white">
                        <div className="mb-4">
                           <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase">Enterprise</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">100+ Sites</h3>
                        <div className="mt-6 mb-2">
                           <span className="text-3xl font-bold text-white">Custom</span>
                        </div>
                        <div className="mb-6 text-sm text-slate-400">Contact us</div>
                        <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-800 transition mt-auto">Contact Sales</button>
                     </div>
                  </div>

                  {/* What's Included */}
                  <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm">
                     <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">What's Included in Every Plan</h3>
                     <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Same comprehensive deliverables. Same data quality. Same insights. The only difference is the number of sites you analyze.</p>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex gap-4">
                           <div className="text-2xl flex-shrink-0">📊</div>
                           <div>
                              <h4 className="font-bold text-slate-900 mb-1">Complete Climate Data</h4>
                              <p className="text-slate-600 text-sm">~900m resolution with 45 years of historical data</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="text-2xl flex-shrink-0">📈</div>
                           <div>
                              <h4 className="font-bold text-slate-900 mb-1">100+ Climate Indicators</h4>
                              <p className="text-slate-600 text-sm">Temperature, precipitation, wind, flooding, and more</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="text-2xl flex-shrink-0">🎯</div>
                           <div>
                              <h4 className="font-bold text-slate-900 mb-1">Multi-Model Ensemble</h4>
                              <p className="text-slate-600 text-sm">60+ CMIP6 models with uncertainty quantification</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="text-2xl flex-shrink-0">📋</div>
                           <div>
                              <h4 className="font-bold text-slate-900 mb-1">Compliance-Ready Reports</h4>
                              <p className="text-slate-600 text-sm">TCFD/IFRS S2 aligned documentation</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="text-2xl flex-shrink-0">✅</div>
                           <div>
                              <h4 className="font-bold text-slate-900 mb-1">Data Validation</h4>
                              <p className="text-slate-600 text-sm">Daily validation against 50+ years of observational data</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="text-2xl flex-shrink-0">🔄</div>
                           <div>
                              <h4 className="font-bold text-slate-900 mb-1">Multiple Formats</h4>
                              <p className="text-slate-600 text-sm">Excel, CSV, PDF, PPT, JSON</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Pricing Note */}
                  <p className="text-center mt-12 text-slate-600 bg-blue-50 border border-blue-200 rounded-xl p-6">
                     <span className="font-bold text-slate-900">What you own:</span> All analysis is perpetual. One-time purchase. You own the data. Same quality deliverables across all plan sizes.
                  </p>
               </div>
            </section>

            {/* Contact Form */}
            <section id="contact" className="py-24 bg-gradient-to-r from-blue-800 to-teal-700 text-white">
               <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-3xl font-bold mb-4">See Your Climate Future Clearly</h2>
                  <p className="text-white/90 mb-12">If you have assets anywhere on Earth, we can show you how the climate around them is changing.</p>
                  
                  <form ref={form} onSubmit={sendEmail} className="bg-white rounded-2xl p-8 shadow-2xl text-left space-y-6">
                     {/* Hidden template fields for EmailJS */}
                     <input type="hidden" name="from_name" />
                     <input type="hidden" name="reply_to" />
                     <input type="hidden" name="to_email" value="contact@climateriskproject.com" />
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                           <input name="first_name" type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                           <input name="last_name" type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                        <input name="user_email" type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Number of Sites</label>
                        <div className="grid grid-cols-3 gap-4">
                           <label className="border rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 text-slate-600">
                              <input value="1-10" type="radio" name="sites" className="text-blue-600 focus:ring-blue-500" /> 1-10
                           </label>
                           <label className="border rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 text-slate-600">
                              <input value="11-100" type="radio" name="sites" className="text-blue-600 focus:ring-blue-500" /> 11-100
                           </label>
                           <label className="border rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 text-slate-600">
                              <input value="100+" type="radio" name="sites" className="text-blue-600 focus:ring-blue-500" /> 100+
                           </label>
                        </div>
                     </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Query Type</label>
                          <select name="query_type" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900">
                             <option value="General">General inquiry</option>
                             <option value="Pricing">Pricing</option>
                             <option value="Technical">Technical / Integration</option>
                             <option value="Partnership">Partnership</option>
                             <option value="Other">Other</option>
                          </select>
                       </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tell us about your assets (optional)</label>
                        <textarea name="message" rows="3" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"></textarea>
                     </div>
                     <button type="submit" disabled={isSending} className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg transition text-lg">
                       {isSending ? 'Sending…' : 'Request Data Access'}
                     </button>
                     {submitStatus && (
                       <p className="mt-3 text-sm text-slate-700">{submitStatus}</p>
                     )}
                  </form>
               </div>
            </section>
          </>
        )}

        {activeTab === 'samples' && (
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-slate-900">Sample Data: Asset-Level Precision</h2>
               <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Below is a sample of the granular data we deliver. Select a tab to view specific climate indicators and their projected shifts across different emission scenarios (Low, Medium, High).</p>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Sample Tabs */}
                <div className="flex border-b border-slate-200 overflow-x-auto">
                   {[
                      { id: 'temperature', label: 'Temperature', icon: <ThermometerSun className="w-4 h-4"/> },
                      { id: 'precipitation', label: 'Precipitation', icon: <Droplets className="w-4 h-4"/> },
                      { id: 'flood', label: 'River Flood Risk', icon: <AlertTriangle className="w-4 h-4"/> },
                   ].map((tab) => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveSampleTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition ${activeSampleTab === tab.id ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                         {tab.icon} {tab.label}
                      </button>
                   ))}
                </div>

                {/* Table Content */}
                <div className="p-6 overflow-x-auto">
                   {activeSampleTab === 'temperature' && (
                      <table className="w-full text-sm text-left">
                         <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                            <tr>
                               <th className="px-4 py-3">Metric</th>
                               <th className="px-4 py-3 text-slate-900">Present</th>
                               <th className="px-4 py-3 text-blue-600">2050 Low</th>
                               <th className="px-4 py-3 text-orange-500">2050 Med</th>
                               <th className="px-4 py-3 text-red-600">2050 High</th>
                               <th className="px-4 py-3 text-blue-600">2085 Low</th>
                               <th className="px-4 py-3 text-orange-500">2085 Med</th>
                               <th className="px-4 py-3 text-red-600">2085 High</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {sampleData.temperature.map((row, i) => (
                               <tr key={i} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 font-medium text-slate-900">{row.metric}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono">{row.present}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-blue-50/30">{row.l2050}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-orange-50/30">{row.m2050}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-red-50/30 font-bold">{row.h2050}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-blue-50/30">{row.l2085}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-orange-50/30">{row.m2085}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-red-50/30 font-bold">{row.h2085}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   )}

                  {activeSampleTab === 'precipitation' && (
                      <table className="w-full text-sm text-left">
                         <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                            <tr>
                               <th className="px-4 py-3">Metric</th>
                               <th className="px-4 py-3 text-slate-900">Present</th>
                               <th className="px-4 py-3 text-blue-600">2050 Low</th>
                               <th className="px-4 py-3 text-orange-500">2050 Med</th>
                               <th className="px-4 py-3 text-red-600">2050 High</th>
                               <th className="px-4 py-3 text-blue-600">2085 Low</th>
                               <th className="px-4 py-3 text-orange-500">2085 Med</th>
                               <th className="px-4 py-3 text-red-600">2085 High</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {sampleData.precipitation.map((row, i) => (
                               <tr key={i} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 font-medium text-slate-900">{row.metric}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono">{row.present}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-blue-50/30">{row.l2050}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-orange-50/30">{row.m2050}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-red-50/30 font-bold">{row.h2050}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-blue-50/30">{row.l2085}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-orange-50/30">{row.m2085}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-red-50/30 font-bold">{row.h2085}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   )}

                  {activeSampleTab === 'flood' && (
                      <table className="w-full text-sm text-left">
                         <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                            <tr>
                               <th className="px-4 py-3">Hazard Event</th>
                               <th className="px-4 py-3 text-slate-900">Present Height</th>
                               <th className="px-4 py-3 text-blue-600">2030 Low</th>
                               <th className="px-4 py-3 text-orange-500">2030 Med</th>
                               <th className="px-4 py-3 text-red-600">2030 High</th>
                               <th className="px-4 py-3 text-blue-600">2040 Low</th>
                               <th className="px-4 py-3 text-orange-500">2040 Med</th>
                               <th className="px-4 py-3 text-red-600">2040 High</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {sampleData.flood.map((row, i) => (
                               <tr key={i} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 font-medium text-slate-900">{row.event}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono font-bold">{row.present}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-blue-50/30">{row.l2030}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-orange-50/30">{row.m2030}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-red-50/30">{row.h2030}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-blue-50/30">{row.l2040}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-orange-50/30">{row.m2040}</td>
                                  <td className="px-4 py-3 text-slate-600 font-mono bg-red-50/30 font-bold">{row.h2040}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   )}
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
                   * Projections based on multi-model CMIP6 ensembles. "L" = Low Emission (SSP1-2.6), "M" = Medium (SSP2-4.5), "H" = High (SSP5-8.5).
                </div>
             </div>
           </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Global Risk Monitor</h2>
                  <p className="text-slate-500 mt-1">Real-time anomaly detection and long-term projection analysis.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['heat', 'flood', 'drought'].map((risk) => (
                    <button 
                      key={risk}
                      onClick={() => setSelectedRisk(risk)}
                      className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition ${selectedRisk === risk ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
             </div>

             {/* Dashboard Grid */}
             <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Map Area (Mock) */}
                <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 min-h-[500px] relative overflow-hidden group">
                   {/* Map Background Effect */}
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 grayscale mix-blend-luminosity transition duration-700 group-hover:scale-105"></div>
                   <div className="relative z-10 flex justify-between items-start">
                      <div className="bg-slate-900/80 backdrop-blur p-4 rounded-xl border border-slate-700">
                        <h3 className="text-slate-300 text-sm uppercase tracking-widest font-semibold">Active Layer</h3>
                        <div className="text-2xl font-bold text-white capitalize flex items-center gap-2">
                          {selectedRisk === 'heat' && <ThermometerSun className="text-orange-500" />}
                          {selectedRisk === 'flood' && <Droplets className="text-blue-500" />}
                          {selectedRisk === 'drought' && <Wind className="text-yellow-500" />}
                          {selectedRisk} Risk
                        </div>
                      </div>
                      <div className="bg-slate-900/80 backdrop-blur p-2 rounded-lg border border-slate-700">
                        <Layers className="text-slate-400 h-5 w-5" />
                      </div>
                   </div>
                   
                   {/* Map Data Points (Mock) */}
                   <div className="absolute top-1/2 left-1/4 h-4 w-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
                   <div className="absolute top-1/3 right-1/3 h-6 w-6 bg-orange-500 rounded-full animate-pulse opacity-50"></div>
                   <div className="absolute bottom-1/4 right-1/4 h-3 w-3 bg-yellow-500 rounded-full opacity-75"></div>

                   <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full w-full mb-2"></div>
                      <div className="flex justify-between text-xs text-slate-300 font-mono">
                        <span>Low Vulnerability</span>
                        <span>Moderate</span>
                        <span>Extreme Risk</span>
                      </div>
                   </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                  {/* Metric Card 1 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-500 uppercase">Risk Level</h4>
                      <AlertTriangle className={`h-5 w-5 ${selectedRisk === 'heat' ? 'text-red-500' : selectedRisk === 'flood' ? 'text-blue-500' : 'text-orange-500'}`} />
                    </div>
                    <div className="text-4xl font-bold text-slate-900 mb-1">{dashboardData[selectedRisk].level}</div>
                    <div className="text-sm text-slate-600">{dashboardData[selectedRisk].trend} trend vs 1990 baseline</div>
                  </div>

                  {/* Metric Card 2 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-500 uppercase">Affected Regions</h4>
                      <Map className="h-5 w-5 text-slate-400" />
                    </div>
                    <ul className="space-y-2">
                      {dashboardData[selectedRisk].regions.map((region, i) => (
                        <li key={i} className="flex items-center text-slate-700 text-sm">
                          <span className="w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                          {region}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact Summary */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Projected Impact</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {dashboardData[selectedRisk].impact}
                    </p>
                    <button className="mt-4 w-full py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm transition">
                      Download Regional Report
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-4">
              <Globe className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-lg">ClimateRiskProject</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Asset-level climate risk data for physical risk assessment. Delivered at ~900m resolution. Global coverage for 1980-2100.
            </p>
            <div className="text-xs text-slate-500">
               A unit of Threatrecon Technologies Private Limited.<br/>
               Made with ❤️ in India for the world.<br/>
               <a href="mailto:business@climateriskproject.com" className="text-blue-400 hover:text-blue-300 transition">business@climateriskproject.com</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Data & Compliance</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setActiveTab('samples')} className="hover:text-blue-400 transition">Our Data</button></li>
              <li><a href="#" className="hover:text-blue-400 transition">TCFD Reporting</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">IFRS S2</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">CSRD</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-600">
          &copy; 2025 Climate Risk Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ClimateRiskProject;
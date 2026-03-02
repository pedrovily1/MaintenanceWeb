import { useState, useEffect, useRef } from "react";

/* ─── Global styles ──────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
    input::placeholder, textarea::placeholder { color: #3d4f62; }
    textarea { resize: vertical; }
  `}</style>
);

/* ─── Design tokens ──────────────────────────────────────────── */
const T = {
  bg:       "#02070f",
  surface:  "#070e1a",
  raised:   "#0c1522",
  border:   "rgba(255,255,255,0.06)",
  borderHi: "rgba(255,255,255,0.10)",
  text:     "#f0f4f8",
  muted:    "#8896a6",
  dim:      "#3d4f62",
  blue:     "#3b82f6",
  blueGlow: "rgba(59,130,246,0.12)",
  green:    "#34d399",
  amber:    "#fbbf24",
  red:      "#f87171",
  violet:   "#a78bfa",
};

const card  = (x={}) => ({ background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, overflow:"hidden", ...x });
const inner = (x={}) => ({ background:T.raised,  border:`1px solid ${T.border}`, borderRadius:12, ...x });

/* ─── Responsive hook ────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

/* ─── Data ───────────────────────────────────────────────────── */
const ALL_WORK_ORDERS = [
  { id:"WO-1114", tag:"PRIADLS",   status:"Scheduled", priority:"High",   asset:"00385 Test-Prv/M-AC 00330", location:"Building A · Floor 2", tech:"Kullo Have",   due:"Jun 26, 2024", created:"Jun 10, 2024", category:"Preventive", color:"#3b82f6", hours:4, cost:320 },
  { id:"WO-0529", tag:"IMD-ORSNG", status:"On Hold",   priority:"Medium", asset:"00657 Test-Prv/M-OC 00220", location:"Building B · Floor 1", tech:"Naiu Gcall",   due:"Jun 20, 2024", created:"Jun 08, 2024", category:"Corrective", color:"#fbbf24", hours:6, cost:480 },
  { id:"WO-0534", tag:"IMD-ORGNG", status:"Ongoing",   priority:"High",   asset:"00885 Test-Prv/M-AC 00330", location:"Building A · Floor 3", tech:"Jan Deach",    due:"Jun 26, 2024", created:"Jun 12, 2024", category:"Inspection", color:"#34d399", hours:2, cost:160 },
  { id:"WO-0226", tag:"IMD-ORSNG", status:"Ongoing",   priority:"Low",    asset:"00866 Test-Prv/M-OC 00330", location:"Building C · Floor 1", tech:"Edco Have",    due:"Jun 20, 2024", created:"Jun 09, 2024", category:"Corrective", color:"#34d399", hours:3, cost:240 },
  { id:"WO-0872", tag:"PRIADLS",   status:"Completed", priority:"High",   asset:"00445 Pump-Station-02",      location:"Pump Room · Level B1",  tech:"Sara Vance",   due:"Jun 15, 2024", created:"Jun 01, 2024", category:"Preventive", color:"#8896a6", hours:5, cost:410 },
  { id:"WO-0991", tag:"IMD-ORGNG", status:"Completed", priority:"Medium", asset:"00321 HVAC-Unit-07",         location:"Roof · Section D",      tech:"Liam Torres",  due:"Jun 14, 2024", created:"Jun 02, 2024", category:"Inspection", color:"#8896a6", hours:3, cost:255 },
  { id:"WO-1203", tag:"PRIADLS",   status:"Scheduled", priority:"Medium", asset:"00782 Conveyor-Belt-A4",     location:"Warehouse · Zone 2",    tech:"Kullo Have",   due:"Jul 02, 2024", created:"Jun 18, 2024", category:"Preventive", color:"#3b82f6", hours:7, cost:560 },
  { id:"WO-0644", tag:"IMD-ORSNG", status:"On Hold",   priority:"High",   asset:"00190 Boiler-Unit-01",       location:"Boiler Room · B2",      tech:"Naiu Gcall",   due:"Jun 22, 2024", created:"Jun 11, 2024", category:"Emergency",  color:"#f87171", hours:8, cost:720 },
  { id:"WO-1345", tag:"IMD-ORGNG", status:"Ongoing",   priority:"Low",    asset:"00556 Elevator-Shaft-3",     location:"Building A · Shaft C",  tech:"Jan Deach",    due:"Jun 28, 2024", created:"Jun 15, 2024", category:"Inspection", color:"#34d399", hours:2, cost:130 },
  { id:"WO-0778", tag:"PRIADLS",   status:"Scheduled", priority:"High",   asset:"00614 Generator-Backup-02",  location:"Generator Room · B1",   tech:"Edco Have",    due:"Jul 05, 2024", created:"Jun 20, 2024", category:"Preventive", color:"#3b82f6", hours:6, cost:495 },
  { id:"WO-0433", tag:"IMD-ORSNG", status:"Completed", priority:"Low",    asset:"00277 Lighting-Control-Sys", location:"Building B · Floor 3",  tech:"Sara Vance",   due:"Jun 12, 2024", created:"Jun 03, 2024", category:"Corrective", color:"#8896a6", hours:1, cost:80  },
  { id:"WO-1089", tag:"IMD-ORGNG", status:"Ongoing",   priority:"Medium", asset:"00903 Air-Compressor-06",    location:"Utility Room · A1",     tech:"Liam Torres",  due:"Jun 30, 2024", created:"Jun 19, 2024", category:"Preventive", color:"#34d399", hours:4, cost:340 },
];

const ALL_ASSETS = [
  { id:"AST-00385", name:"Test-Prv/M-AC Unit 330",  type:"HVAC",       category:"Mechanical", status:"Good",     location:"Building A · Floor 2", building:"Building A", model:"Carrier 50XC",   serial:"SN-4421-B", manufacturer:"Carrier",     installed:"Mar 15, 2019", lastPM:"May 02, 2024", nextPM:"Aug 02, 2024", uptime:98.2, mttr:1.2, openWO:1, totalWO:14, criticality:"High",   cost:12400, color:"#34d399", icon:"❄️" },
  { id:"AST-00657", name:"Pump Station Prv/M 220",   type:"Pump",       category:"Mechanical", status:"Alert",    location:"Building B · Floor 1", building:"Building B", model:"Grundfos CM5",   serial:"SN-8872-A", manufacturer:"Grundfos",    installed:"Jul 08, 2020", lastPM:"Apr 18, 2024", nextPM:"Jul 18, 2024", uptime:91.4, mttr:3.8, openWO:2, totalWO:9,  criticality:"High",   cost:8700,  color:"#fbbf24", icon:"⚙️" },
  { id:"AST-00885", name:"Test-Prv/M-AC Unit 330 B", type:"HVAC",       category:"Mechanical", status:"Good",     location:"Building A · Floor 3", building:"Building A", model:"Carrier 50XC",   serial:"SN-4422-B", manufacturer:"Carrier",     installed:"Mar 15, 2019", lastPM:"May 10, 2024", nextPM:"Aug 10, 2024", uptime:99.1, mttr:0.8, openWO:1, totalWO:11, criticality:"Medium", cost:12400, color:"#34d399", icon:"❄️" },
  { id:"AST-00866", name:"Pump Station Prv/M 330",   type:"Pump",       category:"Mechanical", status:"Good",     location:"Building C · Floor 1", building:"Building C", model:"Grundfos CM8",   serial:"SN-8873-A", manufacturer:"Grundfos",    installed:"Sep 20, 2021", lastPM:"Jun 01, 2024", nextPM:"Sep 01, 2024", uptime:96.7, mttr:1.5, openWO:1, totalWO:7,  criticality:"Medium", cost:9100,  color:"#34d399", icon:"⚙️" },
  { id:"AST-00445", name:"Pump Station 02",          type:"Pump",       category:"Plumbing",   status:"Critical", location:"Pump Room · Level B1",  building:"Basement",   model:"Flygt 3127",     serial:"SN-1193-C", manufacturer:"Xylem",       installed:"Jan 10, 2017", lastPM:"Jan 22, 2024", nextPM:"Apr 22, 2024", uptime:74.3, mttr:8.2, openWO:3, totalWO:28, criticality:"High",   cost:31000, color:"#f87171", icon:"💧" },
  { id:"AST-00321", name:"HVAC Unit 07",             type:"HVAC",       category:"Mechanical", status:"Good",     location:"Roof · Section D",      building:"Rooftop",    model:"Trane XR15",     serial:"SN-2290-T", manufacturer:"Trane",       installed:"Jun 05, 2018", lastPM:"May 28, 2024", nextPM:"Aug 28, 2024", uptime:97.8, mttr:1.1, openWO:0, totalWO:19, criticality:"Medium", cost:17500, color:"#34d399", icon:"❄️" },
  { id:"AST-00782", name:"Conveyor Belt A4",         type:"Conveyor",   category:"Production", status:"Alert",    location:"Warehouse · Zone 2",    building:"Warehouse",  model:"FlexLink XK",    serial:"SN-5541-F", manufacturer:"FlexLink",    installed:"Nov 12, 2020", lastPM:"Mar 30, 2024", nextPM:"Jun 30, 2024", uptime:88.9, mttr:4.1, openWO:2, totalWO:16, criticality:"High",   cost:24600, color:"#fbbf24", icon:"🔧" },
  { id:"AST-00190", name:"Boiler Unit 01",           type:"Boiler",     category:"Mechanical", status:"Critical", location:"Boiler Room · B2",      building:"Basement",   model:"Viessmann 200",  serial:"SN-0091-V", manufacturer:"Viessmann",   installed:"Feb 28, 2015", lastPM:"Dec 14, 2023", nextPM:"Mar 14, 2024", uptime:61.2, mttr:12.4,openWO:3, totalWO:41, criticality:"High",   cost:42000, color:"#f87171", icon:"🔥" },
  { id:"AST-00556", name:"Elevator Shaft 3",         type:"Elevator",   category:"Vertical",   status:"Good",     location:"Building A · Shaft C",  building:"Building A", model:"KONE MonoSpace", serial:"SN-3312-K", manufacturer:"KONE",        installed:"Aug 18, 2016", lastPM:"May 15, 2024", nextPM:"Aug 15, 2024", uptime:99.5, mttr:0.6, openWO:1, totalWO:22, criticality:"High",   cost:85000, color:"#34d399", icon:"🛗" },
  { id:"AST-00614", name:"Generator Backup 02",      type:"Generator",  category:"Electrical", status:"Good",     location:"Generator Room · B1",   building:"Basement",   model:"CAT 3516",       serial:"SN-7762-C", manufacturer:"Caterpillar", installed:"May 03, 2018", lastPM:"Jun 05, 2024", nextPM:"Sep 05, 2024", uptime:99.8, mttr:0.4, openWO:1, totalWO:8,  criticality:"High",   cost:95000, color:"#34d399", icon:"⚡" },
  { id:"AST-00277", name:"Lighting Control System",  type:"Electrical", category:"Electrical", status:"Good",     location:"Building B · Floor 3",  building:"Building B", model:"Lutron Vive",    serial:"SN-2201-L", manufacturer:"Lutron",      installed:"Oct 22, 2021", lastPM:"Apr 10, 2024", nextPM:"Jul 10, 2024", uptime:99.9, mttr:0.2, openWO:0, totalWO:5,  criticality:"Low",    cost:6200,  color:"#34d399", icon:"💡" },
  { id:"AST-00903", name:"Air Compressor 06",        type:"Compressor", category:"Mechanical", status:"Alert",    location:"Utility Room · A1",     building:"Building A", model:"Atlas Copco GA", serial:"SN-9931-A", manufacturer:"Atlas Copco", installed:"Dec 07, 2019", lastPM:"Feb 20, 2024", nextPM:"May 20, 2024", uptime:85.6, mttr:5.3, openWO:2, totalWO:13, criticality:"Medium", cost:18300, color:"#fbbf24", icon:"💨" },
];

const ALL_INVENTORY = [
  { id:"INV-0001", name:"VM-5001 Valve Module",         pn:"12121",  category:"Procurement", supplier:"Parker Hannifin",   unit:"EA", unitCost:148,  stock:0,  minStock:2, maxStock:10, location:"Shelf A-3",   asset:"AST-00657", lastOrdered:"May 10, 2024", icon:"\u{1F529}" },
  { id:"INV-0002", name:"Linear Bearing Shaft 20mm",    pn:"990971", category:"Production",  supplier:"SKF Group",         unit:"EA", unitCost:67,   stock:0,  minStock:2, maxStock:8,  location:"Shelf B-1",   asset:"AST-00782", lastOrdered:"Apr 22, 2024", icon:"\u2699\uFE0F" },
  { id:"INV-0003", name:"IC-300 Circuit Breaker",       pn:"40751",  category:"Electrical",  supplier:"Schneider Electric",unit:"EA", unitCost:212,  stock:1,  minStock:0, maxStock:4,  location:"Cabinet E-2", asset:"AST-00277", lastOrdered:"Jun 01, 2024", icon:"\u26A1" },
  { id:"INV-0004", name:"HVAC Air Filter MERV-13",      pn:"AF-M13", category:"HVAC",        supplier:"Carrier Corp",      unit:"PK", unitCost:38,   stock:12, minStock:4, maxStock:30, location:"Shelf C-2",   asset:"AST-00385", lastOrdered:"Jun 05, 2024", icon:"\u2744\uFE0F" },
  { id:"INV-0005", name:"Mechanical Seal Type B",       pn:"MS-B22", category:"Plumbing",    supplier:"John Crane",        unit:"EA", unitCost:185,  stock:2,  minStock:3, maxStock:8,  location:"Shelf A-7",   asset:"AST-00445", lastOrdered:"Mar 18, 2024", icon:"\U0001F4A7" },
  { id:"INV-0006", name:"NLGI #2 Bearing Grease 5kg",  pn:"GR-502", category:"Lubricants",  supplier:"Shell",             unit:"TN", unitCost:55,   stock:6,  minStock:2, maxStock:12, location:"Shelf D-1",   asset:"AST-00385", lastOrdered:"May 28, 2024", icon:"\U0001F6E2\uFE0F" },
  { id:"INV-0007", name:"V-Belt Drive B-Section",       pn:"VB-B42", category:"Mechanical",  supplier:"Gates Corp",        unit:"EA", unitCost:29,   stock:0,  minStock:4, maxStock:16, location:"Shelf B-4",   asset:"AST-00782", lastOrdered:"Feb 14, 2024", icon:"\U0001F527" },
  { id:"INV-0008", name:"Conveyor Idler Roller 6in",    pn:"IR-600", category:"Production",  supplier:"FlexLink",          unit:"EA", unitCost:94,   stock:8,  minStock:5, maxStock:20, location:"Rack W-3",    asset:"AST-00782", lastOrdered:"Jun 10, 2024", icon:"\U0001F527" },
  { id:"INV-0009", name:"Boiler Gasket Set",            pn:"BG-V22", category:"Mechanical",  supplier:"Viessmann",         unit:"KT", unitCost:320,  stock:1,  minStock:2, maxStock:4,  location:"Shelf A-2",   asset:"AST-00190", lastOrdered:"Jan 08, 2024", icon:"\U0001F525" },
  { id:"INV-0010", name:"3-Phase Motor 7.5kW",          pn:"MT-750", category:"Electrical",  supplier:"ABB",               unit:"EA", unitCost:1840, stock:0,  minStock:1, maxStock:2,  location:"Cage MR-1",   asset:"AST-00657", lastOrdered:"Nov 30, 2023", icon:"\u26A1" },
  { id:"INV-0011", name:"Refrigerant R-410A 25lb",      pn:"RF-410", category:"HVAC",        supplier:"Carrier Corp",      unit:"CL", unitCost:220,  stock:3,  minStock:2, maxStock:8,  location:"Cold Store",  asset:"AST-00885", lastOrdered:"May 20, 2024", icon:"\u2744\uFE0F" },
  { id:"INV-0012", name:"Safety Lockout Hasp Kit",      pn:"LO-H10", category:"Safety",      supplier:"Master Lock",       unit:"KT", unitCost:48,   stock:5,  minStock:3, maxStock:10, location:"Cabinet S-1", asset:null,        lastOrdered:"Apr 05, 2024", icon:"\U0001F512" },
  { id:"INV-0013", name:"Elevator Guide Shoe Liner",    pn:"EL-GL3", category:"Vertical",    supplier:"KONE",              unit:"PR", unitCost:275,  stock:2,  minStock:2, maxStock:4,  location:"Shelf A-9",   asset:"AST-00556", lastOrdered:"Mar 25, 2024", icon:"\U0001F6D7" },
  { id:"INV-0014", name:"SAE 40 Chain Lubricant 1L",    pn:"CL-S40", category:"Lubricants",  supplier:"Mobil",             unit:"LT", unitCost:18,   stock:14, minStock:5, maxStock:24, location:"Shelf D-2",   asset:"AST-00782", lastOrdered:"Jun 08, 2024", icon:"\U0001F6E2\uFE0F" },
  { id:"INV-0015", name:"Dial Indicator 0.001in",       pn:"DI-001", category:"Tools",       supplier:"Mitutoyo",          unit:"EA", unitCost:185,  stock:2,  minStock:1, maxStock:3,  location:"Tool Room",   asset:null,        lastOrdered:"Jan 15, 2024", icon:"\U0001F4D0" },
  { id:"INV-0016", name:"Arc Flash Face Shield 40cal",  pn:"AF-40C", category:"Safety",      supplier:"Honeywell",         unit:"EA", unitCost:142,  stock:0,  minStock:2, maxStock:6,  location:"Cabinet S-2", asset:null,        lastOrdered:"Dec 10, 2023", icon:"\U0001F9BA" },
  { id:"INV-0017", name:"Compressor Valve Plate",       pn:"VP-GA6", category:"Mechanical",  supplier:"Atlas Copco",       unit:"EA", unitCost:440,  stock:1,  minStock:1, maxStock:3,  location:"Shelf B-8",   asset:"AST-00903", lastOrdered:"Feb 28, 2024", icon:"\U0001F4A8" },
  { id:"INV-0018", name:"Generator Air Filter",         pn:"GA-CAT", category:"Mechanical",  supplier:"Caterpillar",       unit:"EA", unitCost:88,   stock:3,  minStock:2, maxStock:6,  location:"Shelf C-5",   asset:"AST-00614", lastOrdered:"Jun 05, 2024", icon:"\u26A1" },
];

const DATA = {
  workOrders: ALL_WORK_ORDERS.slice(0,4),
  inventory:  ALL_INVENTORY.filter(i=>i.stock<=i.minStock).slice(0,3),
  tasks: [
    { title:"Work Order Summary",     sub:"Steel Assets",   time:"07:00", tag:"Weekly"  },
    { title:"Asset Downtime",         sub:"All Assets",     time:"11:00", tag:"Monthly" },
    { title:"Technician Performance", sub:"Floor Assets",   time:"10:00", tag:"Weekly"  },
    { title:"Inventory Usage",        sub:"Cooling Assets", time:"10:00", tag:"Monthly" },
  ],
};
/* ─── Shared micro-components ───────────────────────────────── */
const HR = ({ mx=20 }) => <div style={{ height:1, background:T.border, margin:`0 ${mx}px` }} />;

const Badge = ({ label, color }) => (
  <span style={{ display:"inline-flex", alignItems:"center", background:color+"18", color, border:`1px solid ${color}28`, padding:"2px 9px", borderRadius:99, fontSize:10.5, fontWeight:600, letterSpacing:"0.01em", whiteSpace:"nowrap" }}>{label}</span>
);

const statusColor      = s => ({ Scheduled:"#3b82f6","On Hold":"#fbbf24",Ongoing:"#34d399",Completed:"#8896a6",Emergency:"#f87171" }[s]||T.muted);
const priorityColor    = p => ({ High:"#f87171",Medium:"#fbbf24",Low:"#34d399" }[p]||T.muted);
const assetStatusColor = s => s==="Good"?"#34d399":s==="Alert"?"#fbbf24":"#f87171";

const Avatar = ({ name, color, size=30 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(145deg,${color},${color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.38, fontWeight:700, color:"#fff", flexShrink:0, boxShadow:`0 0 0 1.5px ${T.surface},0 0 0 3px ${color}44` }}>{name[0]}</div>
);

const Pill = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{ background:active?"#1a2d4a":"transparent", color:active?"#7aacf0":T.muted, border:`1px solid ${active?"rgba(59,130,246,0.28)":T.border}`, borderRadius:99, padding:"4px 13px", fontSize:11.5, fontWeight:600, cursor:"pointer", transition:"all 0.2s ease", fontFamily:"inherit" }}>{children}</button>
);

function KpiCard({ value, label, icon, color }) {
  const [hov,setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ ...inner({ padding:"18px 20px", cursor:"pointer" }), transform:hov?"translateY(-3px)":"translateY(0)", boxShadow:hov?`0 16px 40px ${color}0d`:"none", borderColor:hov?color+"28":T.border, transition:"all 0.28s cubic-bezier(.34,1.56,.64,1)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:36, fontWeight:800, color, lineHeight:1, letterSpacing:"-0.04em", fontVariantNumeric:"tabular-nums" }}>{value}</div>
          <div style={{ fontSize:11.5, color:T.muted, marginTop:7, fontWeight:500 }}>{label}</div>
        </div>
        <div style={{ width:42, height:42, background:color+"14", border:`1px solid ${color}28`, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19 }}>{icon}</div>
      </div>
    </div>
  );
}

function DonutChart() {
  const segs = [{val:199,color:"#34d399"},{val:55,color:"#fbbf24"},{val:54,color:"#f87171"}];
  const total = segs.reduce((a,s)=>a+s.val,0);
  const r=70, cx=90, cy=90, sw=16, gap=2.8, circ=2*Math.PI*r;
  let consumed=0;
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.raised} strokeWidth={sw+4}/>
      {segs.map(({val,color},i)=>{
        const pct=val/total, dashLen=pct*circ-gap, dashOffset=-(consumed*circ+circ/4);
        consumed+=pct;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${dashLen} ${circ}`} strokeDashoffset={dashOffset} style={{filter:`drop-shadow(0 0 6px ${color}66)`,transition:`all 1s ease ${i*0.15}s`}}/>;
      })}
      <text x={cx} y={cy-7} textAnchor="middle" fill={T.text} fontSize="30" fontWeight="800" fontFamily="'Poppins',sans-serif" style={{letterSpacing:"-0.03em"}}>54</text>
      <text x={cx} y={cy+14} textAnchor="middle" fill={T.muted} fontSize="11" fontFamily="'Poppins',sans-serif">Critical</text>
    </svg>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon:"▣", label:"Dashboard"   },
  { icon:"≡", label:"Work Orders" },
  { icon:"◎", label:"Assets"      },
  { icon:"▦", label:"Inventory"   },
  { icon:"◷", label:"Scheduler"   },
  { icon:"◈", label:"Reports"     },
  { icon:"⊙", label:"Settings"    },
];

function Sidebar({ active, setActive }) {
  return (
    <aside style={{ width:212, background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
      <div style={{ padding:"22px 20px 18px", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:35, height:35, background:"linear-gradient(145deg,#3b82f6,#1d4ed8)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 4px 14px rgba(59,130,246,0.45)" }}>☁</div>
        <span style={{ fontWeight:700, fontSize:17, color:T.text, letterSpacing:"-0.03em" }}>CMMS</span>
      </div>
      <HR/>
      <nav style={{ flex:1, padding:"12px 10px" }}>
        {NAV_ITEMS.map(({icon,label})=>{
          const on=active===label;
          return (
            <div key={label} onClick={()=>setActive(label)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, marginBottom:1, cursor:"pointer", background:on?T.blueGlow:"transparent", color:on?T.blue:T.muted, fontWeight:on?600:400, fontSize:13, transition:"all 0.18s ease", position:"relative" }}>
              {on && <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:18, background:T.blue, borderRadius:"0 3px 3px 0" }}/>}
              <span style={{ fontSize:12, opacity:on?1:0.6 }}>{icon}</span>
              {label}
              {(label==="Inventory"||label==="Reports") && <span style={{ marginLeft:"auto", fontSize:9, opacity:0.35 }}>▼</span>}
            </div>
          );
        })}
      </nav>
      <HR/>
      <div style={{ padding:"14px 16px" }}>
        <div style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Account</div>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <Avatar name="Pedro" color="#fbbf24" size={33}/>
          <div>
            <div style={{ fontSize:12.5, fontWeight:600, color:T.text, lineHeight:1.3 }}>Pedro Modesto</div>
            <div style={{ fontSize:10.5, color:T.dim, fontWeight:300 }}>Maintenance Mgr</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Topbar ─────────────────────────────────────────────────── */
function Topbar() {
  return (
    <header style={{ display:"flex", alignItems:"center", padding:"0 22px", height:58, flexShrink:0, borderBottom:`1px solid ${T.border}`, background:T.surface, gap:12 }}>
      <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, ...inner({ padding:"7px 14px", borderRadius:12, maxWidth:400 }) }}>
        <span style={{ color:T.dim, fontSize:13 }}>⌕</span>
        <input placeholder="Search anything…" style={{ background:"none", border:"none", outline:"none", color:T.muted, fontSize:13, width:"100%", fontFamily:"inherit" }}/>
      </div>
      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ position:"relative", cursor:"pointer" }}>
          <div style={{ ...inner({ width:34, height:34, borderRadius:10 }), display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🔔</div>
          <div style={{ position:"absolute", top:-3, right:-3, width:16, height:16, background:T.red, borderRadius:"50%", fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"#fff", border:`2px solid ${T.surface}` }}>2</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Avatar name="Pedro" color="#fbbf24" size={34}/>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.text, lineHeight:1.3 }}>Pedro Modesto</div>
            <div style={{ fontSize:10.5, color:T.dim, fontWeight:300 }}>Maintenance Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Procedure library ──────────────────────────────────────── */
const PROCEDURE_LIBRARY = [
  {
    id:"PROC-001", name:"HVAC Preventive Maintenance", category:"Preventive", estimatedTime:"2h", version:"v3.1",
    fields:[
      { id:"f1",  type:"heading",         label:"Safety & Preparation",                                                       required:false },
      { id:"f2",  type:"yesno",           label:"LOTO applied and verified?",                                                 required:true  },
      { id:"f3",  type:"inspection",      label:"PPE condition (gloves, face shield, FR clothing)",                           required:true  },
      { id:"f4",  type:"heading",         label:"Filter & Airflow",                                                          required:false },
      { id:"f5",  type:"inspection",      label:"Air filter condition",                                                       required:true  },
      { id:"f6",  type:"multiplechoice",  label:"Filter action required", options:["No action","Clean only","Replace"],      required:true  },
      { id:"f7",  type:"meter",           label:"Filter differential pressure (inWC)",  unit:"inWC",   min:0, max:2,         required:true  },
      { id:"f8",  type:"heading",         label:"Refrigerant & Mechanical",                                                   required:false },
      { id:"f9",  type:"meter",           label:"Suction pressure",                      unit:"PSI",    min:0, max:150,       required:true  },
      { id:"f10", type:"meter",           label:"Discharge pressure",                    unit:"PSI",    min:0, max:500,       required:true  },
      { id:"f11", type:"inspection",      label:"Belt condition (tension, cracks, glazing)",                                  required:true  },
      { id:"f12", type:"yesno",           label:"Bearings lubricated?",                                                      required:false },
      { id:"f13", type:"heading",         label:"Controls & Safety",                                                         required:false },
      { id:"f14", type:"meter",           label:"Thermostat calibration offset (°F)",    unit:"°F",     min:-5, max:5,       required:true  },
      { id:"f15", type:"yesno",           label:"All safety controls tested and passed?",                                    required:true  },
      { id:"f16", type:"inspection",      label:"Condenser coil cleanliness",                                                 required:true  },
      { id:"f17", type:"heading",         label:"Documentation & Sign-Off",                                                  required:false },
      { id:"f18", type:"photo",           label:"Photo: Unit before service",                                                 required:false },
      { id:"f19", type:"photo",           label:"Photo: Filter / coil condition",                                             required:true  },
      { id:"f20", type:"notes",           label:"Findings and observations",                                                  required:false },
      { id:"f21", type:"date",            label:"Service completed date",                                                     required:true  },
      { id:"f22", type:"signature",       label:"Technician signature",                                                       required:true  },
    ],
  },
  {
    id:"PROC-002", name:"Pump Inspection & Servicing", category:"Preventive", estimatedTime:"1.5h", version:"v2.4",
    fields:[
      { id:"f1",  type:"heading",         label:"Isolation & Preparation",                                                    required:false },
      { id:"f2",  type:"checklist",       label:"Isolation checklist", items:["Inlet valve closed","Outlet valve closed","Drain valve opened","Pressure gauge reads 0 PSI"], required:true },
      { id:"f3",  type:"heading",         label:"Mechanical Inspection",                                                      required:false },
      { id:"f4",  type:"inspection",      label:"Mechanical seal condition",                                                   required:true  },
      { id:"f5",  type:"meter",           label:"Seal leakage drops per minute",          unit:"drops/min", min:0, max:10,   required:true  },
      { id:"f6",  type:"meter",           label:"DE bearing temperature",                 unit:"°F",    min:50, max:250,      required:true  },
      { id:"f7",  type:"meter",           label:"NDE bearing temperature",                unit:"°F",    min:50, max:250,      required:true  },
      { id:"f8",  type:"meter",           label:"Coupling misalignment (TIR)",            unit:"in",    min:0, max:0.02,     required:true  },
      { id:"f9",  type:"inspection",      label:"Impeller and casing wear",                                                   required:false },
      { id:"f10", type:"heading",         label:"Run Test",                                                                   required:false },
      { id:"f11", type:"meter",           label:"Flow rate",                              unit:"GPM",   min:0, max:500,      required:true  },
      { id:"f12", type:"meter",           label:"Differential pressure",                  unit:"PSI",   min:0, max:200,      required:true  },
      { id:"f13", type:"meter",           label:"Motor current draw",                     unit:"Amps",  min:0, max:100,      required:true  },
      { id:"f14", type:"inspection",      label:"Vibration and noise during run test",                                        required:true  },
      { id:"f15", type:"heading",         label:"Close-Out",                                                                  required:false },
      { id:"f16", type:"photo",           label:"Photo: Seal area",                                                           required:true  },
      { id:"f17", type:"notes",           label:"Additional findings",                                                        required:false },
      { id:"f18", type:"date",            label:"Inspection date",                                                            required:true  },
      { id:"f19", type:"signature",       label:"Inspector signature",                                                        required:true  },
    ],
  },
  {
    id:"PROC-003", name:"Electrical Panel Inspection", category:"Inspection", estimatedTime:"45m", version:"v1.8",
    fields:[
      { id:"f1",  type:"heading",         label:"PPE Verification",                                                          required:false },
      { id:"f2",  type:"checklist",       label:"PPE checklist", items:["Class 0 rubber gloves","Arc flash face shield (40 cal/cm²)","FR clothing worn","Safety glasses under shield"], required:true },
      { id:"f3",  type:"heading",         label:"Visual Inspection",                                                         required:false },
      { id:"f4",  type:"inspection",      label:"Breakers — trip indicators, burn marks, discoloration",                     required:true  },
      { id:"f5",  type:"number",          label:"Number of breakers requiring replacement",                                   required:true  },
      { id:"f6",  type:"inspection",      label:"Bus bar connections — corrosion, loose hardware",                           required:true  },
      { id:"f7",  type:"heading",         label:"Thermal Imaging",                                                           required:false },
      { id:"f8",  type:"yesno",           label:"IR scan performed at ≥80% load?",                                           required:true  },
      { id:"f9",  type:"meter",           label:"Hottest connection temperature above ambient",  unit:"°F", min:0, max:100, required:true  },
      { id:"f10", type:"multiplechoice",  label:"Thermal finding severity", options:["None — all normal","Minor (<10°F rise)","Moderate (10–17°F rise)","Critical (≥18°F rise)"], required:true },
      { id:"f11", type:"photo",           label:"IR scan image — hottest point",                                              required:true  },
      { id:"f12", type:"heading",         label:"Grounding & Torque",                                                        required:false },
      { id:"f13", type:"meter",           label:"Ground bus continuity resistance",            unit:"Ω",   min:0, max:1,    required:true  },
      { id:"f14", type:"yesno",           label:"All connections re-torqued to specification?",                               required:true  },
      { id:"f15", type:"heading",         label:"Sign-Off",                                                                   required:false },
      { id:"f16", type:"notes",           label:"Deficiencies noted",                                                         required:false },
      { id:"f17", type:"date",            label:"Inspection date",                                                            required:true  },
      { id:"f18", type:"signature",       label:"Inspector signature",                                                        required:true  },
    ],
  },
  {
    id:"PROC-004", name:"Conveyor Belt Maintenance", category:"Preventive", estimatedTime:"3h", version:"v2.0",
    fields:[
      { id:"f1",  type:"heading",         label:"Lockout / Tagout",                                                          required:false },
      { id:"f2",  type:"checklist",       label:"LOTO verification", items:["All drive motors locked out","Gravity take-up secured","Pneumatics depressurized","Zero energy verified with tester"], required:true },
      { id:"f3",  type:"heading",         label:"Belt Condition",                                                             required:false },
      { id:"f4",  type:"meter",           label:"Belt sag at center span",                   unit:"in",    min:0, max:6,    required:true  },
      { id:"f5",  type:"inspection",      label:"Belt surface — cuts, gouges, edge damage",                                  required:true  },
      { id:"f6",  type:"inspection",      label:"Mechanical splices — broken fasteners, misalignment",                       required:true  },
      { id:"f7",  type:"number",          label:"Number of splices requiring repair",                                         required:true  },
      { id:"f8",  type:"heading",         label:"Drive Components",                                                          required:false },
      { id:"f9",  type:"inspection",      label:"Drive chain — wear, elongation, lubrication",                               required:true  },
      { id:"f10", type:"yesno",           label:"Drive chain lubricated?",                                                   required:false },
      { id:"f11", type:"number",          label:"Number of idler rollers replaced",                                          required:true  },
      { id:"f12", type:"heading",         label:"Emergency Stop Testing",                                                    required:false },
      { id:"f13", type:"meter",           label:"E-stop 1 response time",                    unit:"sec",   min:0, max:10,   required:true  },
      { id:"f14", type:"meter",           label:"E-stop 2 response time",                    unit:"sec",   min:0, max:10,   required:true  },
      { id:"f15", type:"yesno",           label:"All E-stops passed (≤3 sec)?",                                              required:true  },
      { id:"f16", type:"heading",         label:"Run Test & Close-Out",                                                      required:false },
      { id:"f17", type:"meter",           label:"Motor current at 100% speed",               unit:"Amps",  min:0, max:200,  required:true  },
      { id:"f18", type:"photo",           label:"Photo: Belt splice condition",                                               required:true  },
      { id:"f19", type:"notes",           label:"Defects, replacements, and remarks",                                         required:false },
      { id:"f20", type:"date",            label:"Maintenance date",                                                           required:true  },
      { id:"f21", type:"signature",       label:"Technician sign-off",                                                        required:true  },
    ],
  },
];

const WO_PROCEDURES = {
  "WO-1114":"PROC-001","WO-0529":"PROC-002","WO-0534":"PROC-001",
  "WO-0226":"PROC-002","WO-0872":"PROC-001","WO-0991":"PROC-003",
  "WO-1203":"PROC-004","WO-0644":null,       "WO-1345":"PROC-003",
  "WO-0778":"PROC-001","WO-0433":"PROC-003", "WO-1089":"PROC-002",
};

/* ─── Field type metadata ─────────────────────────────────────── */
const FIELD_META = {
  heading:       { icon:"H",  color:"#8896a6", label:"Heading"        },
  blocktext:     { icon:"¶",  color:"#8896a6", label:"Block Text"     },
  notes:         { icon:"📝", color:"#8896a6", label:"Notes"          },
  number:        { icon:"#",  color:"#3b82f6", label:"Number"         },
  multiplechoice:{ icon:"☰",  color:"#a78bfa", label:"Multiple Choice"},
  yesno:         { icon:"?",  color:"#34d399", label:"Yes/No/N/A"     },
  inspection:    { icon:"🔍", color:"#fbbf24", label:"Inspection"     },
  date:          { icon:"📅", color:"#3b82f6", label:"Date"           },
  photo:         { icon:"📷", color:"#f87171", label:"Photo"          },
  file:          { icon:"📎", color:"#8896a6", label:"File Upload"    },
  signature:     { icon:"✍",  color:"#a78bfa", label:"Signature"     },
  meter:         { icon:"📊", color:"#34d399", label:"Meter Reading"  },
  checklist:     { icon:"☑",  color:"#3b82f6", label:"Checklist"      },
};

/* ─── Field components ───────────────────────────────────────── */
function FieldHeading({ field }) {
  return (
    <div style={{ paddingTop:8, paddingBottom:2 }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ flex:1, height:1, background:T.border }} />
        {field.label}
        <div style={{ flex:1, height:1, background:T.border }} />
      </div>
    </div>
  );
}

function FieldBlock({ field }) {
  return (
    <div style={{ ...inner({ padding:"11px 13px" }), borderLeft:`3px solid ${T.dim}` }}>
      <p style={{ fontSize:12, color:T.muted, lineHeight:1.75, fontWeight:300 }}>{field.label}</p>
    </div>
  );
}

function FieldNotes({ field, value, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {field.label}{field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
      </label>
      <textarea value={value||""} onChange={e=>onChange(e.target.value)} rows={3} placeholder="Type notes here…"
        style={{ background:T.raised, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:12.5, color:T.text, outline:"none", fontFamily:"inherit", lineHeight:1.7, resize:"vertical", transition:"border-color 0.15s" }}
        onFocus={e=>e.target.style.borderColor=T.blue+"66"}
        onBlur={e=>e.target.style.borderColor=T.border}
      />
    </div>
  );
}

function FieldNumber({ field, value, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {field.label}{field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
      </label>
      <input type="number" value={value||""} onChange={e=>onChange(e.target.value)} placeholder="Enter number…"
        style={{ background:T.raised, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 13px", fontSize:14, fontWeight:600, color:T.text, outline:"none", fontFamily:"inherit", fontVariantNumeric:"tabular-nums", transition:"border-color 0.15s", maxWidth:200 }}
        onFocus={e=>e.target.style.borderColor=T.blue+"66"}
        onBlur={e=>e.target.style.borderColor=T.border}
      />
    </div>
  );
}

function FieldMultipleChoice({ field, value, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {field.label}{field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
      </label>
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        {(field.options||[]).map(opt => {
          const sel = value===opt;
          return (
            <div key={opt} onClick={()=>onChange(sel?null:opt)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", ...inner({ borderRadius:9 }), borderColor:sel?T.blue+"55":T.border, cursor:"pointer", transition:"all 0.15s" }}>
              <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${sel?T.blue:T.dim}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
                {sel && <div style={{ width:8, height:8, borderRadius:"50%", background:T.blue }} />}
              </div>
              <span style={{ fontSize:13, color:sel?T.text:T.muted, fontWeight:sel?500:400 }}>{opt}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FieldYesNo({ field, value, onChange }) {
  const opts = ["Yes","No","N/A"];
  const colors = { Yes:"#34d399", No:"#f87171", "N/A":"#8896a6" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {field.label}{field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
      </label>
      <div style={{ display:"flex", gap:6 }}>
        {opts.map(opt => {
          const sel = value===opt; const col = colors[opt];
          return (
            <button key={opt} onClick={()=>onChange(sel?null:opt)}
              style={{ flex:1, padding:"9px 6px", borderRadius:9, fontSize:12.5, fontWeight:sel?700:400, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s", background:sel?col+"22":"transparent", color:sel?col:T.dim, border:`1.5px solid ${sel?col+"66":T.border}` }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FieldInspection({ field, value, onChange }) {
  const opts = [
    { label:"Pass",  icon:"✓", color:"#34d399" },
    { label:"Flag",  icon:"⚑", color:"#fbbf24" },
    { label:"Fail",  icon:"✕", color:"#f87171" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {field.label}{field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
      </label>
      <div style={{ display:"flex", gap:6 }}>
        {opts.map(({ label, icon, color }) => {
          const sel = value===label;
          return (
            <button key={label} onClick={()=>onChange(sel?null:label)}
              style={{ flex:1, padding:"11px 6px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", transition:"all 0.18s", background:sel?color+"22":"transparent", border:`1.5px solid ${sel?color+"66":T.border}`, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <span style={{ fontSize:18, lineHeight:1 }}>{icon}</span>
              <span style={{ fontSize:11, fontWeight:sel?700:400, color:sel?color:T.dim }}>{label}</span>
            </button>
          );
        })}
      </div>
      {value==="Flag"&&(
        <textarea placeholder="Describe the observation that requires follow-up…" rows={2}
          style={{ background:T.raised, border:`1px solid ${"#fbbf24"+"44"}`, borderRadius:9, padding:"9px 11px", fontSize:12, color:T.text, outline:"none", fontFamily:"inherit", resize:"vertical" }} />
      )}
      {value==="Fail"&&(
        <textarea placeholder="Describe the failure condition and immediate action taken…" rows={2}
          style={{ background:T.raised, border:`1px solid ${"#f87171"+"44"}`, borderRadius:9, padding:"9px 11px", fontSize:12, color:T.text, outline:"none", fontFamily:"inherit", resize:"vertical" }} />
      )}
    </div>
  );
}

function FieldDate({ field, value, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {field.label}{field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
      </label>
      <input type="date" value={value||""} onChange={e=>onChange(e.target.value)}
        style={{ background:T.raised, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 13px", fontSize:13, color:value?T.text:T.dim, outline:"none", fontFamily:"inherit", transition:"border-color 0.15s", maxWidth:200, colorScheme:"dark" }}
        onFocus={e=>e.target.style.borderColor=T.blue+"66"}
        onBlur={e=>e.target.style.borderColor=T.border}
      />
    </div>
  );
}

function FieldPhoto({ field, value, onChange }) {
  const [dragging, setDragging] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {field.label}{field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
      </label>
      {value ? (
        <div style={{ ...inner({ padding:"10px 13px" }), display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, background:"#3b82f622", border:"1px solid #3b82f633", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📷</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12.5, fontWeight:500, color:T.text }}>{value}</div>
            <div style={{ fontSize:11, color:T.dim, marginTop:1 }}>Photo attached</div>
          </div>
          <button onClick={()=>onChange(null)} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:14 }}>✕</button>
        </div>
      ) : (
        <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);onChange("photo_"+Date.now()+".jpg");}}
          onClick={()=>onChange("photo_"+Date.now()+".jpg")}
          style={{ border:`2px dashed ${dragging?T.blue:T.border}`, borderRadius:12, padding:"20px 16px", textAlign:"center", cursor:"pointer", transition:"all 0.15s", background:dragging?T.blueGlow:"transparent" }}>
          <div style={{ fontSize:26, marginBottom:6 }}>📷</div>
          <div style={{ fontSize:12.5, color:T.muted, fontWeight:500 }}>Tap to capture or upload photo</div>
          <div style={{ fontSize:11, color:T.dim, marginTop:3, fontWeight:300 }}>PNG, JPG, HEIC accepted</div>
        </div>
      )}
    </div>
  );
}

function FieldFile({ field, value, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {field.label}{field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
      </label>
      {value ? (
        <div style={{ ...inner({ padding:"10px 13px" }), display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:20 }}>📎</span>
          <div style={{ flex:1, fontSize:12.5, fontWeight:500, color:T.text }}>{value}</div>
          <button onClick={()=>onChange(null)} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:14 }}>✕</button>
        </div>
      ) : (
        <button onClick={()=>onChange("file_"+Date.now()+".pdf")}
          style={{ background:T.raised, border:`1px dashed ${T.border}`, borderRadius:10, padding:"12px", fontSize:12.5, color:T.muted, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <span>📎</span> Attach file
        </button>
      )}
    </div>
  );
}

function FieldSignature({ field, value, onChange }) {
  const canvasRef = useRef(null);
  const drawing   = useRef(false);
  const lastPt    = useRef(null);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const pt = e.touches ? e.touches[0] : e;
    return { x: pt.clientX - r.left, y: pt.clientY - r.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawing.current = true;
    lastPt.current = getPos(e, canvasRef.current);
  };
  const draw = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pt = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPt.current.x, lastPt.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = "#7aacf0";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPt.current = pt;
    onChange("signed");
  };
  const endDraw = () => { drawing.current = false; };
  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    onChange(null);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
          {field.label}{field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
        </label>
        {value && <button onClick={clear} style={{ background:"none", border:"none", color:T.dim, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Clear</button>}
      </div>
      <div style={{ ...inner({ padding:0, overflow:"hidden" }), borderColor: value?"#a78bfa55":T.border, position:"relative" }}>
        <canvas ref={canvasRef} width={600} height={120}
          style={{ display:"block", width:"100%", height:80, cursor:"crosshair", touchAction:"none" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        {!value && (
          <div style={{ position:"absolute", pointerEvents:"none", fontSize:12, color:T.dim, fontWeight:300, left:12, top:"50%", transform:"translateY(-50%)" }}>Sign here…</div>
        )}
      </div>
      <div style={{ fontSize:10.5, color:T.dim, fontWeight:300 }}>Draw your signature above</div>
    </div>
  );
}

function FieldMeter({ field, value, onChange }) {
  const pct = value && field.max ? Math.min(100, Math.max(0, ((Number(value) - (field.min||0)) / (field.max - (field.min||0))) * 100)) : 0;
  const col  = pct > 85 ? T.red : pct > 60 ? T.amber : T.green;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
        {field.label}{field.unit && <span style={{ fontWeight:300, marginLeft:5, color:T.dim }}>({field.unit})</span>}
        {field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
      </label>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <input type="number" value={value||""} onChange={e=>onChange(e.target.value)}
          min={field.min} max={field.max} placeholder={`${field.min??0} – ${field.max??"∞"}`}
          style={{ background:T.raised, border:`1px solid ${T.border}`, borderRadius:10, padding:"9px 13px", fontSize:14, fontWeight:600, color:value?col:T.muted, outline:"none", fontFamily:"inherit", fontVariantNumeric:"tabular-nums", width:120, transition:"border-color 0.15s" }}
          onFocus={e=>e.target.style.borderColor=T.blue+"66"}
          onBlur={e=>e.target.style.borderColor=T.border}
        />
        {field.unit && <span style={{ fontSize:12, color:T.dim }}>{field.unit}</span>}
      </div>
      {field.max != null && value && (
        <div>
          <div style={{ height:4, background:T.bg, borderRadius:99, overflow:"hidden" }}>
            <div style={{ width:`${pct}%`, height:"100%", background:col, borderRadius:99, transition:"width 0.3s ease, background 0.3s" }} />
          </div>
          <div style={{ fontSize:10, color:T.dim, marginTop:3 }}>Range: {field.min??0} – {field.max} {field.unit}</div>
        </div>
      )}
    </div>
  );
}

function FieldChecklist({ field, value={}, onChange }) {
  const items = field.items || [];
  const toggle = (item) => onChange({ ...value, [item]: !value[item] });
  const allDone = items.every(it => value[it]);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <label style={{ fontSize:11, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
          {field.label}{field.required && <span style={{ color:T.red, marginLeft:3 }}>*</span>}
        </label>
        <span style={{ fontSize:10.5, color:allDone?"#34d399":T.dim, fontWeight:600 }}>{items.filter(i=>value[i]).length}/{items.length}</span>
      </div>
      <div style={{ ...inner({ padding:"4px 6px" }), display:"flex", flexDirection:"column", gap:1 }}>
        {items.map((item, i) => {
          const done = !!value[item];
          return (
            <div key={i} onClick={()=>toggle(item)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 8px", borderRadius:8, cursor:"pointer", transition:"background 0.1s", background:done?"rgba(52,211,153,0.05)":"transparent" }}>
              <div style={{ width:20, height:20, borderRadius:5, flexShrink:0, background:done?"#34d399":T.bg, border:`1.5px solid ${done?"#34d399":T.dim}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", transition:"all 0.18s", boxShadow:done?"0 0 8px #34d39944":"none" }}>
                {done && "✓"}
              </div>
              <span style={{ fontSize:12.5, color:done?T.dim:T.text, textDecoration:done?"line-through":"none", fontWeight:done?300:400, lineHeight:1.4 }}>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Field renderer — picks the right component ─────────────── */
function ProcedureField({ field, value, onChange }) {
  const v   = value;
  const onC = onChange;
  switch(field.type) {
    case "heading":        return <FieldHeading     field={field} />;
    case "blocktext":      return <FieldBlock       field={field} />;
    case "notes":          return <FieldNotes       field={field} value={v} onChange={onC} />;
    case "number":         return <FieldNumber      field={field} value={v} onChange={onC} />;
    case "multiplechoice": return <FieldMultipleChoice field={field} value={v} onChange={onC} />;
    case "yesno":          return <FieldYesNo       field={field} value={v} onChange={onC} />;
    case "inspection":     return <FieldInspection  field={field} value={v} onChange={onC} />;
    case "date":           return <FieldDate        field={field} value={v} onChange={onC} />;
    case "photo":          return <FieldPhoto       field={field} value={v} onChange={onC} />;
    case "file":           return <FieldFile        field={field} value={v} onChange={onC} />;
    case "signature":      return <FieldSignature   field={field} value={v} onChange={onC} />;
    case "meter":          return <FieldMeter       field={field} value={v} onChange={onC} />;
    case "checklist":      return <FieldChecklist   field={field} value={v||{}} onChange={onC} />;
    default: return null;
  }
}

/* ─── Procedure Library picker ────────────────────────────────── */
function ProcedureLibrary({ currentId, onSelect, onBack }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:2 }}>
        <button onClick={onBack} style={{ background:T.raised, border:`1px solid ${T.border}`, borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.muted, fontSize:14, fontFamily:"inherit", flexShrink:0 }}>←</button>
        <span style={{ fontSize:13, fontWeight:600, color:T.text }}>Procedure Library</span>
        <span style={{ marginLeft:"auto", fontSize:11, color:T.dim }}>{PROCEDURE_LIBRARY.length} procedures</span>
      </div>

      {/* No procedure */}
      <div onClick={()=>onSelect(null)}
        style={{ ...inner({ padding:"13px 14px" }), cursor:"pointer", borderColor:currentId===null?T.blue+"66":T.border, transition:"border-color 0.15s" }}
        onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderHi}
        onMouseLeave={e=>e.currentTarget.style.borderColor=currentId===null?T.blue+"66":T.border}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.muted, marginBottom:2 }}>No Procedure</div>
            <div style={{ fontSize:11, color:T.dim, fontWeight:300 }}>Complete without a guided checklist</div>
          </div>
          {currentId===null && <div style={{ width:18, height:18, borderRadius:"50%", background:T.blue, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff" }}>✓</div>}
        </div>
      </div>

      {PROCEDURE_LIBRARY.map(p => {
        const reqCount = p.fields.filter(f=>f.required).length;
        const typeBreakdown = Object.entries(
          p.fields.reduce((acc,f)=>{ if(f.type!=="heading"&&f.type!=="blocktext"){ acc[f.type]=(acc[f.type]||0)+1; } return acc; }, {})
        ).slice(0,4);
        return (
          <div key={p.id} onClick={()=>onSelect(p.id)}
            style={{ ...inner({ padding:"14px" }), cursor:"pointer", borderColor:currentId===p.id?T.blue+"66":T.border, transition:"border-color 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderHi}
            onMouseLeave={e=>e.currentTarget.style.borderColor=currentId===p.id?T.blue+"66":T.border}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{p.name}</span>
                  {currentId===p.id && <div style={{ width:16, height:16, borderRadius:"50%", background:T.blue, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", flexShrink:0 }}>✓</div>}
                </div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  <Badge label={p.category} color={T.violet} />
                  <Badge label={`v${p.version||"1.0"}`} color={T.muted} />
                  <Badge label={`~${p.estimatedTime}`} color={T.blue} />
                  <Badge label={`${reqCount} required`} color={T.amber} />
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {typeBreakdown.map(([type, count]) => (
                <div key={type} style={{ display:"flex", alignItems:"center", gap:4, background:T.bg, border:`1px solid ${T.border}`, borderRadius:6, padding:"2px 7px" }}>
                  <span style={{ fontSize:10 }}>{FIELD_META[type]?.icon}</span>
                  <span style={{ fontSize:10, color:T.dim }}>{count}×</span>
                  <span style={{ fontSize:10, color:T.dim }}>{FIELD_META[type]?.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main ProcedureContent ──────────────────────────────────── */
function ProcedureContent({ woId }) {
  const initId = WO_PROCEDURES[woId] ?? null;
  const [procId,      setProcId]      = useState(initId);
  const [showLibrary, setShowLibrary] = useState(false);
  const [responses,   setResponses]   = useState({});

  const proc = PROCEDURE_LIBRARY.find(p => p.id === procId) || null;

  const handleSelect = (id) => { setProcId(id); setResponses({}); setShowLibrary(false); };
  const setField     = (id, val) => setResponses(prev => ({ ...prev, [id]: val }));

  // Progress calculation — only non-heading, required fields
  const requiredFields = proc ? proc.fields.filter(f => f.required && f.type !== "heading" && f.type !== "blocktext") : [];
  const completedRequired = requiredFields.filter(f => {
    const v = responses[f.id];
    if (f.type === "checklist") return f.items && f.items.every(it => v && v[it]);
    if (f.type === "signature") return v === "signed";
    return v !== undefined && v !== null && v !== "";
  });
  const pct = requiredFields.length > 0 ? Math.round((completedRequired.length / requiredFields.length) * 100) : 0;
  const allDone = requiredFields.length > 0 && pct === 100;

  if (showLibrary) {
    return <ProcedureLibrary currentId={procId} onSelect={handleSelect} onBack={()=>setShowLibrary(false)} />;
  }

  if (!proc) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, padding:"28px 0" }}>
        <div style={{ width:60, height:60, background:T.raised, border:`1px solid ${T.border}`, borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>📋</div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:14, fontWeight:600, color:T.text, marginBottom:5 }}>No Procedure Attached</div>
          <div style={{ fontSize:12, color:T.dim, fontWeight:300, lineHeight:1.75, maxWidth:220 }}>Attach a standard operating procedure to guide technicians through this work order.</div>
        </div>
        <button onClick={()=>setShowLibrary(true)} style={{ background:"#1a2d4a", color:"#7aacf0", border:"1px solid rgba(59,130,246,0.28)", borderRadius:12, padding:"11px 22px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          📚  Browse Procedures
        </button>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {/* Header */}
      <div style={inner({ padding:"14px" })}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:6, lineHeight:1.3 }}>{proc.name}</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              <Badge label={proc.category} color={T.violet} />
              <Badge label={`v${proc.version||"1.0"}`} color={T.muted} />
              <Badge label={`~${proc.estimatedTime}`} color={T.blue} />
            </div>
          </div>
          <button onClick={()=>setShowLibrary(true)} style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:8, padding:"5px 11px", fontSize:11, color:T.muted, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", marginLeft:8, flexShrink:0 }}>Change</button>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
          <span style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>Required fields</span>
          <span style={{ fontSize:12, fontWeight:700, color:allDone?"#34d399":T.blue }}>{completedRequired.length}/{requiredFields.length} · {pct}%</span>
        </div>
        <div style={{ height:6, background:T.bg, borderRadius:99, overflow:"hidden" }}>
          <div style={{ width:`${pct}%`, height:"100%", background:allDone?"#34d399":`linear-gradient(90deg,${T.blue},${T.violet})`, borderRadius:99, transition:"width 0.4s ease" }} />
        </div>
      </div>

      {/* Fields */}
      {proc.fields.map(field => (
        <ProcedureField
          key={field.id}
          field={field}
          value={responses[field.id]}
          onChange={val => setField(field.id, val)}
        />
      ))}

      {/* Completion state */}
      {allDone ? (
        <div style={{ ...inner({ padding:"16px", borderRadius:14 }), textAlign:"center", borderColor:"#34d39966", background:"rgba(52,211,153,0.07)" }}>
          <div style={{ fontSize:26, marginBottom:6 }}>✅</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#34d399", marginBottom:3 }}>Procedure Complete</div>
          <div style={{ fontSize:12, color:T.dim, fontWeight:300 }}>All required fields filled. Ready to close work order.</div>
        </div>
      ) : (
        <div style={{ fontSize:11, color:T.dim, textAlign:"center", fontWeight:300, paddingTop:4 }}>
          {requiredFields.length - completedRequired.length} required field{requiredFields.length - completedRequired.length !== 1 ? "s" : ""} remaining
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP — Work Order Detail Panel
═══════════════════════════════════════════════════════════════ */
function WODetailPanel({ wo, onClose }) {
  const [tab,setTab]=useState("Details");
  const TABS=["Details","Procedure","Activity","Parts","Attachments"];
  const activity=[
    {user:"Kullo Have",   action:"Updated status to Ongoing",        time:"2h ago",  color:"#34d399"},
    {user:"Pedro Modesto",action:"Assigned to Kullo Have",           time:"5h ago",  color:"#fbbf24"},
    {user:"System",       action:"Work order created automatically",  time:"Jun 12",  color:"#3b82f6"},
  ];
  const parts=[
    {name:"Bearing Assembly",qty:2,status:"In Stock",cost:"$45"},
    {name:"Lubricant 5L",    qty:1,status:"In Stock",cost:"$28"},
    {name:"Seal Kit Type B", qty:1,status:"On Order",cost:"$62"},
  ];

  const procId = WO_PROCEDURES[wo.id];
  const proc   = PROCEDURE_LIBRARY.find(p=>p.id===procId);

  return (
    <div style={{width:340,background:T.surface,borderLeft:`1px solid ${T.border}`,display:"flex",flexDirection:"column",flexShrink:0,animation:"slideIn 0.22s cubic-bezier(.34,1.2,.64,1)"}}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>

      {/* Header */}
      <div style={{padding:"18px 20px 14px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div>
            <div style={{fontSize:11,color:T.dim,fontWeight:500,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:4}}>Work Order</div>
            <div style={{fontSize:17,fontWeight:700,color:T.text,letterSpacing:"-0.02em"}}>{wo.id}</div>
          </div>
          <button onClick={onClose} style={{background:T.raised,border:`1px solid ${T.border}`,borderRadius:8,width:30,height:30,cursor:"pointer",color:T.muted,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <Badge label={wo.status}             color={statusColor(wo.status)} />
          <Badge label={`${wo.priority} Priority`} color={priorityColor(wo.priority)} />
          <Badge label={wo.category}           color={T.violet} />
          {proc ? <Badge label={`📋 ${proc.name.split(" ").slice(0,2).join(" ")}…`} color={"#34d399"} /> : <Badge label="No Procedure" color={T.dim} />}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",padding:"0 4px",borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",fontFamily:"inherit",color:tab===t?T.blue:T.dim,borderBottom:`2px solid ${tab===t?T.blue:"transparent"}`,padding:"10px 12px 10px",fontSize:11.5,fontWeight:tab===t?600:400,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
            {t==="Procedure" ? "📋 Procedure" : t}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 18px"}}>

        {tab==="Details"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={inner({padding:"12px 14px"})}>
              <div style={{fontSize:10,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Assigned Technician</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Avatar name={wo.tech} color={wo.color} size={36} />
                <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{wo.tech}</div><div style={{fontSize:11,color:T.dim,fontWeight:300}}>Field Technician · Active</div></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{label:"Asset",value:wo.asset.slice(0,16)+"…"},{label:"Location",value:wo.location},{label:"Due Date",value:wo.due},{label:"Created",value:wo.created},{label:"Est. Hours",value:`${wo.hours}h`},{label:"Est. Cost",value:`$${wo.cost}`}].map(({label,value})=>(
                <div key={label} style={inner({padding:"10px 12px"})}>
                  <div style={{fontSize:9.5,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{label}</div>
                  <div style={{fontSize:12,fontWeight:500,color:T.text,lineHeight:1.4}}>{value}</div>
                </div>
              ))}
            </div>
            <div style={inner({padding:"12px 14px"})}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:10,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}}>Completion</span><span style={{fontSize:12,fontWeight:600,color:T.blue}}>65%</span></div>
              <div style={{height:5,background:T.bg,borderRadius:99,overflow:"hidden"}}><div style={{width:"65%",height:"100%",background:`linear-gradient(90deg,${T.blue},${T.violet})`,borderRadius:99,transition:"width 1s ease"}} /></div>
            </div>
            <div style={inner({padding:"12px 14px"})}>
              <div style={{fontSize:10,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Notes</div>
              <p style={{fontSize:12,color:T.muted,lineHeight:1.7,fontWeight:300}}>Routine inspection of unit {wo.id}. Check belt tension and bearing alignment. Replace lubrication if necessary. Document all findings.</p>
            </div>
          </div>
        )}

        {tab==="Procedure"&&<ProcedureContent woId={wo.id} />}

        {tab==="Activity"&&(
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {activity.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:12,paddingBottom:16,position:"relative"}}>
                {i<activity.length-1&&<div style={{position:"absolute",left:13,top:28,width:1,height:"calc(100% - 12px)",background:T.border}} />}
                <Avatar name={a.user} color={a.color} size={26} />
                <div><div style={{fontSize:12,fontWeight:600,color:T.text}}>{a.user}</div><div style={{fontSize:11.5,color:T.muted,marginTop:2,fontWeight:300}}>{a.action}</div><div style={{fontSize:10.5,color:T.dim,marginTop:4}}>{a.time}</div></div>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <input placeholder="Add a comment…" style={{flex:1,background:T.raised,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 12px",fontSize:12,color:T.text,outline:"none",fontFamily:"inherit"}} />
              <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.28)",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Send</button>
            </div>
          </div>
        )}

        {tab==="Parts"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {parts.map((p,i)=>(
              <div key={i} style={{...inner({padding:"11px 13px"}),display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div><div style={{fontSize:12.5,fontWeight:600,color:T.text}}>{p.name}</div><div style={{fontSize:11,color:T.dim,marginTop:2,fontWeight:300}}>Qty: {p.qty}</div></div>
                <div style={{textAlign:"right"}}><Badge label={p.status} color={p.status==="In Stock"?T.green:T.amber} /><div style={{fontSize:12,fontWeight:600,color:T.muted,marginTop:4}}>{p.cost}</div></div>
              </div>
            ))}
            <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:12,padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",marginTop:4,fontFamily:"inherit"}}>+ Request Part</button>
          </div>
        )}

        {tab==="Attachments"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {["Inspection_Report.pdf","Photo_Before.jpg","Maintenance_Manual.pdf"].map((f,i)=>(
              <div key={i} style={{...inner({padding:"11px 13px"}),display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,background:T.bg,border:`1px solid ${T.border}`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{f.endsWith(".pdf")?"📄":"🖼️"}</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500,color:T.text}}>{f}</div><div style={{fontSize:10.5,color:T.dim,fontWeight:300,marginTop:1}}>Jun 12, 2024</div></div>
                <span style={{color:T.blue,fontSize:13,cursor:"pointer"}}>↓</span>
              </div>
            ))}
            <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:12,padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",marginTop:4,fontFamily:"inherit"}}>+ Upload File</button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{padding:"14px 18px",borderTop:`1px solid ${T.border}`,display:"flex",gap:8}}>
        <button style={{flex:1,background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:12,padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Edit</button>
        <button style={{flex:1,background:T.raised,color:T.muted,border:`1px solid ${T.border}`,borderRadius:12,padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Print</button>
        <button style={{flex:1,background:"rgba(248,113,113,0.12)",color:"#f87171",border:"1px solid rgba(248,113,113,0.22)",borderRadius:12,padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Close WO</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP — Work Orders View
═══════════════════════════════════════════════════════════════ */
function WorkOrdersView() {
  const [filter,  setFilter]  = useState("All");
  const [search,  setSearch]  = useState("");
  const [selected,setSelected]= useState(null);
  const [sortCol, setSortCol] = useState("due");
  const [sortDir, setSortDir] = useState(1);

  const tabs=["All","Scheduled","Ongoing","On Hold","Completed"];
  const filtered=ALL_WORK_ORDERS.filter(w=>filter==="All"||w.status===filter).filter(w=>!search||w.id.toLowerCase().includes(search.toLowerCase())||w.asset.toLowerCase().includes(search.toLowerCase())||w.tech.toLowerCase().includes(search.toLowerCase()));
  const stats={total:ALL_WORK_ORDERS.length,ongoing:ALL_WORK_ORDERS.filter(w=>w.status==="Ongoing").length,scheduled:ALL_WORK_ORDERS.filter(w=>w.status==="Scheduled").length,onHold:ALL_WORK_ORDERS.filter(w=>w.status==="On Hold").length};

  const COLS=[
    {key:"id",label:"Work Order",w:"140px"},{key:"status",label:"Status",w:"110px"},
    {key:"priority",label:"Priority",w:"90px"},{key:"asset",label:"Asset",w:"200px"},
    {key:"category",label:"Category",w:"100px"},{key:"tech",label:"Technician",w:"130px"},
    {key:"due",label:"Due Date",w:"110px"},{key:"cost",label:"Cost",w:"80px"},
  ];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
      <div style={{padding:"20px 24px 0",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:700,color:T.text,letterSpacing:"-0.03em"}}>Work Orders</h1>
            <p style={{fontSize:12.5,color:T.dim,fontWeight:300,marginTop:4}}>Manage and track all maintenance work orders</p>
          </div>
          <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.28)",borderRadius:12,padding:"10px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>＋ New Work Order</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          {[{label:"Total Orders",value:stats.total,color:T.blue,icon:"≡"},{label:"In Progress",value:stats.ongoing,color:T.green,icon:"▶"},{label:"Scheduled",value:stats.scheduled,color:T.violet,icon:"◷"},{label:"On Hold",value:stats.onHold,color:T.amber,icon:"⏸"}].map(({label,value,color,icon})=>(
            <div key={label} style={inner({padding:"13px 16px"})}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:26,fontWeight:800,color,letterSpacing:"-0.03em",fontVariantNumeric:"tabular-nums"}}>{value}</div><div style={{fontSize:11,color:T.dim,marginTop:3}}>{label}</div></div>
                <span style={{fontSize:18,opacity:0.4}}>{icon}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{...card({borderRadius:16,overflow:"visible"}),padding:"12px 16px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,...inner({padding:"7px 13px",borderRadius:10}),minWidth:220}}>
            <span style={{color:T.dim,fontSize:13}}>⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders, assets, techs…" style={{background:"none",border:"none",outline:"none",color:T.text,fontSize:12.5,width:"100%",fontFamily:"inherit"}} />
            {search&&<span onClick={()=>setSearch("")} style={{color:T.dim,cursor:"pointer",fontSize:13}}>✕</span>}
          </div>
          <div style={{display:"flex",gap:4}}>
            {tabs.map(t=>(
              <button key={t} onClick={()=>setFilter(t)} style={{background:filter===t?"#1a2d4a":"transparent",color:filter===t?"#7aacf0":T.dim,border:`1px solid ${filter===t?"rgba(59,130,246,0.28)":T.border}`,borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:filter===t?600:400,cursor:"pointer",transition:"all 0.15s",fontFamily:"inherit"}}>{t}</button>
            ))}
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            {["⇅ Sort","⊞ Filter","↓ Export"].map(l=>(
              <button key={l} style={{...inner({padding:"7px 12px",borderRadius:10,border:`1px solid ${T.border}`}),color:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{flex:1,display:"flex",overflow:"hidden",padding:"12px 24px 20px",gap:12}}>
        <div style={{...card({borderRadius:18}),flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:`${COLS.map(c=>c.w).join(" ")} 1fr`,padding:"10px 20px",borderBottom:`1px solid ${T.border}`,flexShrink:0,gap:8}}>
            {COLS.map(col=>(
              <div key={col.key} onClick={()=>{setSortCol(col.key);setSortDir(sortCol===col.key?-sortDir:1);}} style={{fontSize:10,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",cursor:"pointer",display:"flex",alignItems:"center",gap:4,userSelect:"none"}}>
                {col.label}{sortCol===col.key&&<span style={{fontSize:9,opacity:0.7}}>{sortDir>0?"↑":"↓"}</span>}
              </div>
            ))}
            <div style={{fontSize:10,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}}>Actions</div>
          </div>
          <div style={{flex:1,overflowY:"auto"}}>
            {filtered.length===0?(
              <div style={{padding:"60px 20px",textAlign:"center",color:T.dim}}><div style={{fontSize:32,marginBottom:12,opacity:0.3}}>≡</div><div style={{fontSize:14,fontWeight:500}}>No work orders found</div></div>
            ):filtered.map((wo,i)=>{
              const isSel=selected?.id===wo.id;
              const procId=WO_PROCEDURES[wo.id];
              const proc=PROCEDURE_LIBRARY.find(p=>p.id===procId);
              return (
                <div key={wo.id}>
                  <div onClick={()=>setSelected(isSel?null:wo)} style={{display:"grid",gridTemplateColumns:`${COLS.map(c=>c.w).join(" ")} 1fr`,padding:"13px 20px",gap:8,alignItems:"center",cursor:"pointer",background:isSel?T.blueGlow:"transparent",borderLeft:`3px solid ${isSel?T.blue:"transparent"}`,transition:"all 0.15s"}}
                    onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background=T.raised;}} onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="";}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:3,height:28,borderRadius:99,background:wo.color,flexShrink:0}} />
                      <div><div style={{fontSize:12.5,fontWeight:600,color:T.text,fontFamily:"monospace"}}>{wo.id}</div><div style={{fontSize:10,color:T.dim,marginTop:1}}>{wo.tag}</div></div>
                    </div>
                    <div><Badge label={wo.status} color={statusColor(wo.status)} /></div>
                    <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:"50%",background:priorityColor(wo.priority)}} /><span style={{fontSize:12,color:T.muted,fontWeight:500}}>{wo.priority}</span></div>
                    <div><div style={{fontSize:12,color:T.text,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{wo.asset}</div><div style={{fontSize:10.5,color:T.dim,fontWeight:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{wo.location}</div></div>
                    <div><Badge label={wo.category} color={T.violet} /></div>
                    <div style={{display:"flex",alignItems:"center",gap:7}}><Avatar name={wo.tech} color={wo.color} size={22} /><span style={{fontSize:12,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{wo.tech}</span></div>
                    <div style={{fontSize:12,color:T.muted,fontVariantNumeric:"tabular-nums"}}>{wo.due}</div>
                    <div style={{fontSize:12.5,fontWeight:600,color:T.text,fontVariantNumeric:"tabular-nums"}}>${wo.cost}</div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={e=>{e.stopPropagation();setSelected(wo);}} style={{background:T.raised,border:`1px solid ${T.border}`,borderRadius:7,padding:"4px 10px",fontSize:11,color:T.muted,cursor:"pointer",fontFamily:"inherit"}}>View</button>
                      <button onClick={e=>e.stopPropagation()} style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:7,padding:"4px 8px",fontSize:11,color:T.dim,cursor:"pointer",fontFamily:"inherit"}}>⋯</button>
                    </div>
                  </div>
                  {i<filtered.length-1&&<HR mx={20} />}
                </div>
              );
            })}
          </div>
          <div style={{padding:"12px 20px",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <span style={{fontSize:12,color:T.dim,fontWeight:300}}>Showing {filtered.length} of {ALL_WORK_ORDERS.length} work orders</span>
            <div style={{display:"flex",gap:4}}>
              {["‹","1","2","3","›"].map((p,i)=>(
                <button key={i} style={{width:28,height:28,borderRadius:7,background:p==="1"?"#1a2d4a":T.raised,border:`1px solid ${p==="1"?"rgba(59,130,246,0.28)":T.border}`,color:p==="1"?"#7aacf0":T.dim,fontSize:12,fontWeight:p==="1"?600:400,cursor:"pointer",fontFamily:"inherit"}}>{p}</button>
              ))}
            </div>
          </div>
        </div>
        {selected&&<WODetailPanel wo={selected} onClose={()=>setSelected(null)} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP — Asset Detail Panel
═══════════════════════════════════════════════════════════════ */
function AssetDetailPanel({ asset, onClose }) {
  const [tab,setTab]=useState("Overview");
  const tabs=["Overview","Work Orders","Metrics","Documents"];
  const healthHistory=[82,85,88,84,90,91,88,93,89,92,91,asset.uptime];
  const maxH=Math.max(...healthHistory);
  const sc=assetStatusColor(asset.status);
  return (
    <div style={{width:360,background:T.surface,borderLeft:`1px solid ${T.border}`,display:"flex",flexDirection:"column",flexShrink:0,animation:"slideIn 0.22s cubic-bezier(.34,1.2,.64,1)"}}>
      <div style={{padding:"18px 20px 14px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,background:asset.color+"18",border:`1px solid ${asset.color}30`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{asset.icon}</div>
            <div><div style={{fontSize:10,color:T.dim,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{asset.id}</div><div style={{fontSize:15,fontWeight:700,color:T.text,letterSpacing:"-0.02em",lineHeight:1.3}}>{asset.name}</div></div>
          </div>
          <button onClick={onClose} style={{background:T.raised,border:`1px solid ${T.border}`,borderRadius:8,width:30,height:30,cursor:"pointer",color:T.muted,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",flexShrink:0}}>✕</button>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <Badge label={asset.status} color={sc} />
          <Badge label={`${asset.criticality} Criticality`} color={asset.criticality==="High"?"#f87171":asset.criticality==="Medium"?"#fbbf24":"#34d399"} />
          <Badge label={asset.type} color={T.violet} />
        </div>
      </div>
      <div style={{display:"flex",padding:"0 20px",borderBottom:`1px solid ${T.border}`,gap:0}}>
        {tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",fontFamily:"inherit",color:tab===t?T.blue:T.dim,borderBottom:`2px solid ${tab===t?T.blue:"transparent"}`,padding:"10px 10px 10px",fontSize:12,fontWeight:tab===t?600:400,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>{t}</button>)}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        {tab==="Overview"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={inner({padding:"14px"})}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:11,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Uptime</span>
                <span style={{fontSize:20,fontWeight:800,color:asset.uptime>95?"#34d399":asset.uptime>80?"#fbbf24":"#f87171",letterSpacing:"-0.03em"}}>{asset.uptime}%</span>
              </div>
              <div style={{height:6,background:T.bg,borderRadius:99,overflow:"hidden"}}>
                <div style={{width:`${asset.uptime}%`,height:"100%",background:asset.uptime>95?"#34d399":asset.uptime>80?"#fbbf24":"#f87171",borderRadius:99,transition:"width 1s ease"}} />
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                <span style={{fontSize:10.5,color:T.dim,fontWeight:300}}>MTTR: {asset.mttr}h avg</span>
                <span style={{fontSize:10.5,color:T.dim,fontWeight:300}}>{asset.openWO} open WO{asset.openWO!==1?"s":""}</span>
              </div>
            </div>
            <div style={inner({padding:"14px"})}>
              <div style={{fontSize:11,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Health Trend (12mo)</div>
              <div style={{display:"flex",alignItems:"flex-end",gap:3,height:44}}>
                {healthHistory.map((v,i)=>{ const isLast=i===healthHistory.length-1,col=v>95?"#34d399":v>80?"#fbbf24":"#f87171"; return <div key={i} style={{flex:1,height:`${(v/maxH)*100}%`,background:isLast?`linear-gradient(to top,${col},${col}88)`:T.bg,border:`1px solid ${isLast?col+"44":T.border}`,borderBottom:"none",borderRadius:"3px 3px 0 0",transition:"height 0.6s ease"}} />; })}
              </div>
              <div style={{height:1,background:T.border}} />
              <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                {["J","F","M","A","M","J","J","A","S","O","N","D"].map(m=><span key={m} style={{fontSize:9,color:T.dim}}>{m}</span>)}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{label:"Manufacturer",value:asset.manufacturer},{label:"Model",value:asset.model},{label:"Serial No.",value:asset.serial},{label:"Category",value:asset.category},{label:"Installed",value:asset.installed},{label:"Asset Value",value:`$${asset.cost.toLocaleString()}`}].map(({label,value})=>(
                <div key={label} style={inner({padding:"10px 12px"})}><div style={{fontSize:9.5,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{label}</div><div style={{fontSize:12,fontWeight:500,color:T.text}}>{value}</div></div>
              ))}
            </div>
            <div style={inner({padding:"13px 14px"})}>
              <div style={{fontSize:11,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Maintenance Schedule</div>
              {[{label:"Last PM",value:asset.lastPM,icon:"✓",col:"#34d399"},{label:"Next PM Due",value:asset.nextPM,icon:"◷",col:"#fbbf24"}].map(({label,value,icon,col})=>(
                <div key={label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:24,height:24,borderRadius:6,background:col+"18",border:`1px solid ${col}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:col}}>{icon}</div>
                    <span style={{fontSize:12,color:T.muted}}>{label}</span>
                  </div>
                  <span style={{fontSize:12,fontWeight:600,color:T.text}}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="Work Orders"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:12,color:T.muted}}>{asset.totalWO} total work orders</span>
              <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Create WO</button>
            </div>
            {ALL_WORK_ORDERS.slice(0,5).map((wo,i)=>(
              <div key={i} style={{...inner({padding:"11px 13px"}),display:"flex",alignItems:"center",gap:10,cursor:"pointer",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderHi} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                <div style={{width:3,height:30,borderRadius:99,background:wo.color,flexShrink:0}} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:3}}><span style={{fontSize:11,color:T.dim,fontFamily:"monospace"}}>{wo.id}</span><Badge label={wo.status} color={statusColor(wo.status)} /></div>
                  <div style={{fontSize:12,color:T.muted,fontWeight:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{wo.category} · {wo.tech}</div>
                </div>
                <span style={{fontSize:11,color:T.dim,whiteSpace:"nowrap"}}>{wo.due}</span>
              </div>
            ))}
          </div>
        )}
        {tab==="Metrics"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[{label:"Overall Uptime",value:`${asset.uptime}%`,sub:"Last 12 months",color:asset.uptime>95?"#34d399":asset.uptime>80?"#fbbf24":"#f87171",pct:asset.uptime},{label:"Avg MTTR",value:`${asset.mttr}h`,sub:"Mean time to repair",color:"#3b82f6",pct:Math.min(100,(asset.mttr/15)*100)},{label:"PM Compliance",value:"87%",sub:"Planned maintenance",color:"#a78bfa",pct:87},{label:"Cost Efficiency",value:"$"+Math.round(asset.cost/asset.totalWO).toLocaleString(),sub:"Avg cost per WO",color:"#fbbf24",pct:72}].map(({label,value,sub,color,pct})=>(
              <div key={label} style={inner({padding:"13px 14px"})}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div><div style={{fontSize:10,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{label}</div><div style={{fontSize:20,fontWeight:800,color,letterSpacing:"-0.03em"}}>{value}</div></div>
                  <span style={{fontSize:10.5,color:T.dim,fontWeight:300}}>{sub}</span>
                </div>
                <div style={{height:4,background:T.bg,borderRadius:99,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:99,opacity:0.8,transition:"width 1s ease"}} /></div>
              </div>
            ))}
          </div>
        )}
        {tab==="Documents"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[{name:"Installation Manual.pdf",date:"Mar 2019",size:"4.2 MB",icon:"📄"},{name:"Maintenance Procedure.pdf",date:"Jan 2024",size:"1.8 MB",icon:"📄"},{name:"Warranty Certificate.pdf",date:"Mar 2019",size:"0.4 MB",icon:"📋"},{name:"Inspection Report Q1.pdf",date:"Apr 2024",size:"2.1 MB",icon:"📊"}].map((doc,i)=>(
              <div key={i} style={{...inner({padding:"11px 13px"}),display:"flex",alignItems:"center",gap:10,cursor:"pointer",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderHi} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                <div style={{width:36,height:36,background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{doc.icon}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:12.5,fontWeight:500,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.name}</div><div style={{fontSize:10.5,color:T.dim,marginTop:2,fontWeight:300}}>{doc.date} · {doc.size}</div></div>
                <span style={{color:T.blue,fontSize:14,cursor:"pointer"}}>↓</span>
              </div>
            ))}
            <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:12,padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",marginTop:4,fontFamily:"inherit"}}>+ Upload Document</button>
          </div>
        )}
      </div>
      <div style={{padding:"14px 20px",borderTop:`1px solid ${T.border}`,display:"flex",gap:8}}>
        <button style={{flex:1,background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:12,padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Edit Asset</button>
        <button style={{flex:1,background:T.raised,color:T.muted,border:`1px solid ${T.border}`,borderRadius:12,padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Create WO</button>
        <button style={{background:"rgba(248,113,113,0.10)",color:"#f87171",border:"1px solid rgba(248,113,113,0.2)",borderRadius:12,padding:"9px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>⋯</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP — Assets View
═══════════════════════════════════════════════════════════════ */
function AssetsView() {
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");
  const [viewMode,setViewMode]= useState("grid");
  const [selected,setSelected]= useState(null);
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState(1);

  const filtered=ALL_ASSETS.filter(a=>filter==="All"||a.status===filter).filter(a=>!search||a.name.toLowerCase().includes(search.toLowerCase())||a.id.toLowerCase().includes(search.toLowerCase())||a.location.toLowerCase().includes(search.toLowerCase())||a.type.toLowerCase().includes(search.toLowerCase()));
  const stats={total:ALL_ASSETS.length,good:ALL_ASSETS.filter(a=>a.status==="Good").length,alert:ALL_ASSETS.filter(a=>a.status==="Alert").length,critical:ALL_ASSETS.filter(a=>a.status==="Critical").length};

  const COLS=[{key:"name",label:"Asset",w:"220px"},{key:"type",label:"Type",w:"110px"},{key:"status",label:"Status",w:"90px"},{key:"location",label:"Location",w:"200px"},{key:"uptime",label:"Uptime",w:"110px"},{key:"lastPM",label:"Last PM",w:"110px"},{key:"nextPM",label:"Next PM",w:"110px"},{key:"openWO",label:"Open WOs",w:"80px"}];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
      <div style={{padding:"20px 24px 0",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div><h1 style={{fontSize:22,fontWeight:700,color:T.text,letterSpacing:"-0.03em"}}>Assets</h1><p style={{fontSize:12.5,color:T.dim,fontWeight:300,marginTop:4}}>Monitor and manage all facility assets</p></div>
          <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.28)",borderRadius:12,padding:"10px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>＋ Add Asset</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
          {[{label:"Total Assets",value:stats.total,color:T.blue,icon:"◎",pct:null},{label:"Operational",value:stats.good,color:"#34d399",icon:"●",pct:Math.round(stats.good/stats.total*100)},{label:"Needs Attention",value:stats.alert,color:"#fbbf24",icon:"⚠",pct:Math.round(stats.alert/stats.total*100)},{label:"Critical",value:stats.critical,color:"#f87171",icon:"🔴",pct:Math.round(stats.critical/stats.total*100)}].map(({label,value,color,icon,pct})=>(
            <div key={label} style={inner({padding:"13px 16px"})}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:pct!=null?8:0}}>
                <div><div style={{fontSize:28,fontWeight:800,color,letterSpacing:"-0.03em",fontVariantNumeric:"tabular-nums"}}>{value}</div><div style={{fontSize:11,color:T.dim,marginTop:3}}>{label}</div></div>
                <span style={{fontSize:16,opacity:0.5}}>{icon}</span>
              </div>
              {pct!=null&&<div style={{height:3,background:T.bg,borderRadius:99}}><div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:99,opacity:0.7}} /></div>}
            </div>
          ))}
        </div>
        <div style={{...card({borderRadius:16,overflow:"visible"}),padding:"12px 16px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,...inner({padding:"7px 13px",borderRadius:10}),minWidth:200}}>
            <span style={{color:T.dim,fontSize:13}}>⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search assets…" style={{background:"none",border:"none",outline:"none",color:T.text,fontSize:12.5,width:"100%",fontFamily:"inherit"}} />
            {search&&<span onClick={()=>setSearch("")} style={{color:T.dim,cursor:"pointer",fontSize:13}}>✕</span>}
          </div>
          <div style={{display:"flex",gap:4}}>
            {["All","Good","Alert","Critical"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?"#1a2d4a":"transparent",color:filter===f?"#7aacf0":T.dim,border:`1px solid ${filter===f?"rgba(59,130,246,0.28)":T.border}`,borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:filter===f?600:400,cursor:"pointer",transition:"all 0.15s",fontFamily:"inherit"}}>
                {f!=="All"&&<span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:assetStatusColor(f),marginRight:5,verticalAlign:"middle"}} />}{f}
              </button>
            ))}
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            <div style={{display:"flex",gap:2,...inner({padding:"4px",borderRadius:9})}}>
              {[["⊞","grid"],["≡","list"]].map(([icon,mode])=>(
                <button key={mode} onClick={()=>setViewMode(mode)} style={{width:28,height:28,borderRadius:7,border:"none",background:viewMode===mode?"#1a2d4a":"transparent",color:viewMode===mode?"#7aacf0":T.dim,cursor:"pointer",fontSize:14,fontFamily:"inherit",transition:"all 0.15s"}}>{icon}</button>
              ))}
            </div>
            {["⇅ Sort","↓ Export"].map(l=><button key={l} style={{...inner({padding:"7px 12px",borderRadius:10,border:`1px solid ${T.border}`}),color:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
          </div>
        </div>
      </div>
      <div style={{flex:1,display:"flex",overflow:"hidden",padding:"12px 24px 20px",gap:12}}>
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {viewMode==="grid"?(
            <div style={{flex:1,overflowY:"auto"}}>
              {filtered.length===0?(<div style={{padding:"80px 20px",textAlign:"center",color:T.dim}}><div style={{fontSize:40,marginBottom:12,opacity:0.2}}>◎</div><div style={{fontSize:14,fontWeight:500}}>No assets found</div></div>):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12,paddingBottom:4}}>
                  {filtered.map(asset=>{
                    const isSel=selected?.id===asset.id,sc=assetStatusColor(asset.status);
                    return (
                      <div key={asset.id} onClick={()=>setSelected(isSel?null:asset)} style={{...card({borderRadius:18,overflow:"hidden",cursor:"pointer"}),borderColor:isSel?T.blue+"66":T.border,boxShadow:isSel?`0 0 0 1px ${T.blue}44,0 8px 32px ${T.blue}10`:"none",transition:"all 0.2s ease"}}
                        onMouseEnter={e=>{if(!isSel){e.currentTarget.style.borderColor=T.borderHi;e.currentTarget.style.transform="translateY(-2px)";}}} onMouseLeave={e=>{if(!isSel){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="";}}}>
                        <div style={{height:3,background:sc,opacity:0.7}} />
                        <div style={{padding:"16px 18px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                            <div style={{width:42,height:42,background:asset.color+"14",border:`1px solid ${asset.color}28`,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{asset.icon}</div>
                            <div style={{textAlign:"right"}}><Badge label={asset.status} color={sc} /><div style={{fontSize:10,color:T.dim,marginTop:4,fontFamily:"monospace"}}>{asset.id}</div></div>
                          </div>
                          <div style={{marginBottom:14}}>
                            <div style={{fontSize:14,fontWeight:600,color:T.text,lineHeight:1.3,marginBottom:3}}>{asset.name}</div>
                            <div style={{fontSize:11.5,color:T.dim,fontWeight:300}}>📍 {asset.location}</div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                            {[{label:"Uptime",value:`${asset.uptime}%`,color:asset.uptime>95?"#34d399":asset.uptime>80?"#fbbf24":"#f87171"},{label:"MTTR",value:`${asset.mttr}h`,color:T.muted},{label:"Open WOs",value:asset.openWO,color:asset.openWO>0?"#f87171":T.muted}].map(({label,value,color})=>(
                              <div key={label} style={{...inner({padding:"8px 10px",borderRadius:9}),textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color,letterSpacing:"-0.02em"}}>{value}</div><div style={{fontSize:9.5,color:T.dim,marginTop:2}}>{label}</div></div>
                            ))}
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`}}>
                            <div style={{display:"flex",gap:5}}><Badge label={asset.type} color={T.violet} /><Badge label={asset.criticality} color={asset.criticality==="High"?"#f87171":asset.criticality==="Medium"?"#fbbf24":"#34d399"} /></div>
                            <div style={{textAlign:"right"}}><div style={{fontSize:9.5,color:T.dim}}>Next PM</div><div style={{fontSize:11,fontWeight:600,color:T.muted}}>{asset.nextPM}</div></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ):(
            <div style={{...card({borderRadius:18}),flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:`${COLS.map(c=>c.w).join(" ")} 1fr`,padding:"10px 20px",borderBottom:`1px solid ${T.border}`,flexShrink:0,gap:8}}>
                {COLS.map(col=><div key={col.key} onClick={()=>{setSortCol(col.key);setSortDir(sortCol===col.key?-sortDir:1);}} style={{fontSize:10,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",cursor:"pointer",display:"flex",alignItems:"center",gap:4,userSelect:"none"}}>{col.label}{sortCol===col.key&&<span style={{fontSize:9,opacity:0.7}}>{sortDir>0?"↑":"↓"}</span>}</div>)}
                <div style={{fontSize:10,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}}>Actions</div>
              </div>
              <div style={{flex:1,overflowY:"auto"}}>
                {filtered.map((asset,i)=>{
                  const isSel=selected?.id===asset.id,sc=assetStatusColor(asset.status);
                  return (
                    <div key={asset.id}>
                      <div onClick={()=>setSelected(isSel?null:asset)} style={{display:"grid",gridTemplateColumns:`${COLS.map(c=>c.w).join(" ")} 1fr`,padding:"12px 20px",gap:8,alignItems:"center",cursor:"pointer",background:isSel?T.blueGlow:"transparent",borderLeft:`3px solid ${isSel?T.blue:"transparent"}`,transition:"all 0.15s"}}
                        onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background=T.raised;}} onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="";}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:34,height:34,background:asset.color+"14",border:`1px solid ${asset.color}28`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{asset.icon}</div>
                          <div><div style={{fontSize:12.5,fontWeight:600,color:T.text}}>{asset.name}</div><div style={{fontSize:10,color:T.dim,fontFamily:"monospace",marginTop:1}}>{asset.id}</div></div>
                        </div>
                        <div><Badge label={asset.type} color={T.violet} /></div>
                        <div><Badge label={asset.status} color={sc} /></div>
                        <div style={{fontSize:12,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{asset.location}</div>
                        <div>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11.5,fontWeight:600,color:asset.uptime>95?"#34d399":asset.uptime>80?"#fbbf24":"#f87171"}}>{asset.uptime}%</span></div>
                          <div style={{height:4,background:T.bg,borderRadius:99}}><div style={{width:`${asset.uptime}%`,height:"100%",background:asset.uptime>95?"#34d399":asset.uptime>80?"#fbbf24":"#f87171",borderRadius:99,opacity:0.8}} /></div>
                        </div>
                        <div style={{fontSize:12,color:T.muted}}>{asset.lastPM}</div>
                        <div style={{fontSize:12,color:T.muted}}>{asset.nextPM}</div>
                        <div style={{fontSize:13,fontWeight:700,color:asset.openWO>0?"#f87171":T.dim}}>{asset.openWO}</div>
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={e=>{e.stopPropagation();setSelected(asset);}} style={{background:T.raised,border:`1px solid ${T.border}`,borderRadius:7,padding:"4px 10px",fontSize:11,color:T.muted,cursor:"pointer",fontFamily:"inherit"}}>View</button>
                          <button onClick={e=>e.stopPropagation()} style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:7,padding:"4px 8px",fontSize:11,color:T.dim,cursor:"pointer",fontFamily:"inherit"}}>⋯</button>
                        </div>
                      </div>
                      {i<filtered.length-1&&<div style={{height:1,background:T.border,margin:"0 20px"}} />}
                    </div>
                  );
                })}
              </div>
              <div style={{padding:"12px 20px",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
                <span style={{fontSize:12,color:T.dim,fontWeight:300}}>Showing {filtered.length} of {ALL_ASSETS.length} assets</span>
                <div style={{display:"flex",gap:4}}>
                  {["‹","1","2","›"].map((p,i)=><button key={i} style={{width:28,height:28,borderRadius:7,background:p==="1"?"#1a2d4a":T.raised,border:`1px solid ${p==="1"?"rgba(59,130,246,0.28)":T.border}`,color:p==="1"?"#7aacf0":T.dim,fontSize:12,fontWeight:p==="1"?600:400,cursor:"pointer",fontFamily:"inherit"}}>{p}</button>)}
                </div>
              </div>
            </div>
          )}
        </div>
        {selected&&<AssetDetailPanel asset={selected} onClose={()=>setSelected(null)} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP — Dashboard View
═══════════════════════════════════════════════════════════════ */
function DashboardView() {
  const [woTab,setWoTab]=useState("Scheduled");
  const [taskView,setTaskView]=useState("Week");
  return (
    <div style={{flex:1,overflow:"auto",padding:"18px 22px",display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        <KpiCard value="18" label="Open Work Orders"   icon="⚡" color={T.blue}   />
        <KpiCard value="7"  label="Scheduled WOs"      icon="📅" color={T.violet} />
        <KpiCard value="54" label="Critical Assets"    icon="⚠️" color={T.amber}  />
        <KpiCard value="8"  label="Parts Low on Stock" icon="📦" color={T.red}    />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={card()}>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:600,fontSize:14,letterSpacing:"-0.015em"}}>My Work Orders</span>
            <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ New Work Order</button>
          </div>
          <div style={{display:"flex",gap:2,padding:"0 20px 14px"}}>
            {["All","Created","Scheduled","In Progress","Completed"].map(tab=>(
              <button key={tab} onClick={()=>setWoTab(tab)} style={{background:woTab===tab?T.raised:"transparent",border:`1px solid ${woTab===tab?T.borderHi:"transparent"}`,color:woTab===tab?T.text:T.dim,borderRadius:8,padding:"4px 9px",fontSize:11.5,fontWeight:woTab===tab?600:400,cursor:"pointer",transition:"all 0.15s ease",fontFamily:"inherit"}}>{tab}</button>
            ))}
          </div>
          <HR />
          <div style={{maxHeight:226,overflowY:"auto"}}>
            {DATA.workOrders.map((wo,i)=>(
              <div key={i}>
                <div style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:11,cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.raised} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <div style={{width:3,height:34,borderRadius:99,background:wo.color,flexShrink:0}} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}><span style={{color:T.dim,fontSize:11,fontFamily:"monospace"}}>{wo.id}</span><Badge label={wo.tag} color={T.blue} /><Badge label={wo.status} color={statusColor(wo.status)} /></div>
                    <div style={{fontSize:12.5,color:T.text,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{wo.asset}</div>
                    <div style={{fontSize:11,color:T.dim,marginTop:2}}>👤 {wo.tech}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:9.5,color:T.dim,marginBottom:2,textTransform:"uppercase",letterSpacing:"0.06em"}}>Due</div><div style={{fontSize:12,color:T.muted,fontWeight:600}}>{wo.due}</div></div>
                  <Avatar name={wo.tech} color={wo.color} size={28} />
                </div>
                {i<DATA.workOrders.length-1&&<HR />}
              </div>
            ))}
          </div>
        </div>
        <div style={card()}>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:600,fontSize:14,letterSpacing:"-0.015em"}}>Asset Overview</span>
            <button style={{...inner({padding:"5px 12px",borderRadius:10,border:`1px solid ${T.border}`}),color:T.muted,fontSize:11.5,cursor:"pointer",fontFamily:"inherit"}}>Last 3 Weeks ▾</button>
          </div>
          <div style={{display:"flex"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0 6px 12px 14px",flexShrink:0}}><DonutChart /></div>
            <div style={{flex:1,padding:"6px 16px 14px 4px",display:"flex",flexDirection:"column",gap:7,justifyContent:"center"}}>
              {[{label:"Good",count:199,color:"#34d399"},{label:"Alert",count:55,color:"#fbbf24"},{label:"Critical",count:54,color:"#f87171"}].map(({label,count,color})=>(
                <div key={label} style={{...inner({padding:"9px 12px"}),display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=color+"40"} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`}} /><span style={{fontSize:13,fontWeight:500}}>{label}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:7}}><Badge label={String(count)} color={color} /><span style={{color:T.dim,fontSize:13}}>›</span></div>
                </div>
              ))}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:2}}>
                {[{label:"Downtime",value:"12h 30m"},{label:"MTTR",value:"1h 45m"}].map(({label,value})=>(
                  <div key={label} style={inner({padding:"10px 12px"})}><div style={{fontSize:10,color:T.dim,marginBottom:4,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div><div style={{fontSize:15,fontWeight:700,color:T.text,letterSpacing:"-0.025em",fontVariantNumeric:"tabular-nums"}}>{value}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={card()}>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:600,fontSize:14,letterSpacing:"-0.015em"}}>Inventory Status</span>
            <button style={{...inner({padding:"5px 12px",borderRadius:10,border:`1px solid ${T.border}`}),color:T.muted,fontSize:11.5,cursor:"pointer",fontFamily:"inherit"}}>Manage ▾</button>
          </div>
          <HR />
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 52px 52px 1fr",padding:"8px 20px",gap:6}}>
            {["Part","Status","Min","Stock","Location"].map(h=><div key={h} style={{fontSize:10,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</div>)}
          </div>
          <HR />
          {DATA.inventory.map((item,i)=>(
            <div key={i}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 52px 52px 1fr",padding:"12px 20px",gap:6,alignItems:"center",cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.raised} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{...inner({width:32,height:32,borderRadius:10}),display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>⚙️</div><div><div style={{fontSize:12.5,fontWeight:600,color:T.text}}>{item.name}</div><div style={{fontSize:10.5,color:T.dim,marginTop:1,fontWeight:300}}>{item.pn}</div></div></div>
                <div><Badge label={item.stock===0?"⚠ Low":"OK"} color={item.stock===0?"#f87171":"#34d399"} /></div>
                <div style={{fontSize:13,color:T.muted,fontVariantNumeric:"tabular-nums"}}>{item.min}</div>
                <div style={{fontSize:13,color:item.stock===0?"#f87171":"#34d399",fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{item.stock}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:11.5,color:T.dim}}>Main Storeroom</span><span style={{color:T.blue,fontSize:14}}>›</span></div>
              </div>
              {i<DATA.inventory.length-1&&<HR />}
            </div>
          ))}
        </div>
        <div style={card()}>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:600,fontSize:14,letterSpacing:"-0.015em"}}>Upcoming Tasks</span>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              <Pill active={taskView==="Week"} onClick={()=>setTaskView("Week")}>Week</Pill>
              <Pill active={taskView==="Month"} onClick={()=>setTaskView("Month")}>Month</Pill>
              <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:10,padding:"5px 12px",fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Scheduler</button>
            </div>
          </div>
          <HR />
          {DATA.tasks.map((task,i)=>(
            <div key={i}>
              <div style={{padding:"13px 20px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.raised} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <div style={{...inner({width:36,height:36,borderRadius:12}),display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>📊</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{task.title}</div><div style={{fontSize:11,color:T.dim,marginTop:2,fontWeight:300}}>{task.sub}</div></div>
                <div style={{textAlign:"right",flexShrink:0}}><Badge label={task.tag} color={T.blue} /><div style={{fontSize:11.5,color:T.muted,marginTop:5,fontVariantNumeric:"tabular-nums"}}>🕐 {task.time}</div></div>
              </div>
              {i<DATA.tasks.length-1&&<HR />}
            </div>
          ))}
        </div>
      </div>
      <div style={card({padding:"18px 22px"})}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:600,fontSize:14,letterSpacing:"-0.015em"}}>Maintenance Cost Trend</span>
          <div style={{display:"flex",gap:5}}><Pill active>Week</Pill><Pill>Month</Pill></div>
        </div>
        <div style={{height:56,display:"flex",alignItems:"flex-end",gap:3}}>
          {[4,6,3,8,5,9,7,4,6,8,5,7,9,6,8,5,7,4,6,8,5,3,7,5,9,6,4,8,5,7].map((v,i,a)=>{
            const recent=i>a.length-9;
            return <div key={i} style={{flex:1,height:`${(v/9)*100}%`,background:recent?`linear-gradient(to top,${T.blue},${T.blue}99)`:T.raised,borderRadius:"3px 3px 0 0",border:`1px solid ${recent?T.blue+"44":T.border}`,borderBottom:"none",boxShadow:recent?`0 0 10px ${T.blue}22`:"none",opacity:recent?1:0.65}} />;
          })}
        </div>
        <div style={{height:1,background:T.border}} />
        <div style={{display:"flex",justifyContent:"space-between",marginTop:7}}>
          {["Jan","Feb","Mar","Apr","May","Jun"].map(m=><span key={m} style={{fontSize:10.5,color:T.dim}}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE — shared bottom sheet
═══════════════════════════════════════════════════════════════ */
function BottomSheet({ title, children, onClose }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(4px)"}} />
      <div style={{position:"relative",background:T.surface,borderRadius:"24px 24px 0 0",border:`1px solid ${T.border}`,borderBottom:"none",maxHeight:"92vh",display:"flex",flexDirection:"column",animation:"sheetUp 0.3s cubic-bezier(.32,1.2,.64,1)",paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        <style>{`@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:99,background:T.dim}} /></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 20px 14px"}}>
          <span style={{fontSize:17,fontWeight:700,color:T.text,letterSpacing:"-0.02em"}}>{title}</span>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:T.muted,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
        </div>
        <div style={{height:1,background:T.border}} />
        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>{children}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE — Work Order detail sheet (with Procedure tab)
═══════════════════════════════════════════════════════════════ */
function MobileWOSheet({ wo, onClose }) {
  const [tab,setTab]=useState("Details");
  const TABS=["Details","Procedure","Activity"];
  const procId=WO_PROCEDURES[wo.id];
  const proc=PROCEDURE_LIBRARY.find(p=>p.id===procId);

  return (
    <BottomSheet title={wo.id} onClose={onClose}>
      {/* Tab bar */}
      <div style={{display:"flex",padding:"0 20px",borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",fontFamily:"inherit",whiteSpace:"nowrap",color:tab===t?T.blue:T.dim,borderBottom:`2px solid ${tab===t?T.blue:"transparent"}`,padding:"11px 14px 11px",fontSize:13,fontWeight:tab===t?600:400,cursor:"pointer"}}>
            {t==="Procedure"?"📋 Procedure":t}
            {t==="Procedure"&&(proc?<span style={{marginLeft:5,fontSize:10,background:"#34d39918",color:"#34d399",border:"1px solid #34d39930",borderRadius:99,padding:"1px 6px"}}>Attached</span>:<span style={{marginLeft:5,fontSize:10,background:T.raised,color:T.dim,border:`1px solid ${T.border}`,borderRadius:99,padding:"1px 6px"}}>None</span>)}
          </button>
        ))}
      </div>

      <div style={{padding:"16px 18px 32px"}}>
        {/* ── Details ── */}
        {tab==="Details"&&(<>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            <Badge label={wo.status}   color={statusColor(wo.status)} />
            <Badge label={`${wo.priority} Priority`} color={priorityColor(wo.priority)} />
            <Badge label={wo.category} color={T.violet} />
          </div>
          <div style={{...inner({padding:"13px 14px",marginBottom:12}),display:"flex",alignItems:"center",gap:10}}>
            <Avatar name={wo.tech} color={wo.color} size={38} />
            <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{wo.tech}</div><div style={{fontSize:11,color:T.dim,fontWeight:300}}>Assigned Technician</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[{label:"Asset",value:wo.asset.slice(0,18)+"…"},{label:"Location",value:wo.location},{label:"Due Date",value:wo.due},{label:"Est. Cost",value:`$${wo.cost}`}].map(({label,value})=>(
              <div key={label} style={inner({padding:"10px 12px"})}>
                <div style={{fontSize:9.5,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{label}</div>
                <div style={{fontSize:12,fontWeight:500,color:T.text}}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{...inner({padding:"12px 14px",marginBottom:14})}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Completion</span><span style={{fontSize:12,fontWeight:600,color:T.blue}}>65%</span></div>
            <div style={{height:6,background:T.bg,borderRadius:99}}><div style={{width:"65%",height:"100%",background:`linear-gradient(90deg,${T.blue},${T.violet})`,borderRadius:99}} /></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:12,padding:"13px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✏ Edit</button>
            <button style={{background:T.raised,color:T.muted,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🖨 Print</button>
            <button style={{background:"rgba(248,113,113,0.10)",color:"#f87171",border:"1px solid rgba(248,113,113,0.2)",borderRadius:12,padding:"13px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",gridColumn:"span 2"}}>✓ Mark Complete</button>
          </div>
        </>)}

        {/* ── Procedure ── */}
        {tab==="Procedure"&&<ProcedureContent woId={wo.id} />}

        {/* ── Activity ── */}
        {tab==="Activity"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[{user:"Kullo Have",action:"Updated status to Ongoing",time:"2h ago",color:"#34d399"},{user:"Pedro Modesto",action:"Assigned to Kullo Have",time:"5h ago",color:"#fbbf24"},{user:"System",action:"Work order created automatically",time:"Jun 12",color:"#3b82f6"}].map((a,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <Avatar name={a.user} color={a.color} size={28} />
                <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{a.user}</div><div style={{fontSize:12,color:T.muted,marginTop:2,fontWeight:300}}>{a.action}</div><div style={{fontSize:11,color:T.dim,marginTop:4}}>{a.time}</div></div>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <input placeholder="Add a comment…" style={{flex:1,background:T.raised,border:`1px solid ${T.border}`,borderRadius:10,padding:"11px 13px",fontSize:13,color:T.text,outline:"none",fontFamily:"inherit"}} />
              <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.28)",borderRadius:10,padding:"11px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Send</button>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE — Work Orders list
═══════════════════════════════════════════════════════════════ */
function MobileWorkOrders() {
  const [filter,  setFilter]  = useState("All");
  const [selected,setSelected]= useState(null);
  const filters=["All","Scheduled","Ongoing","On Hold","Completed"];
  const filtered=ALL_WORK_ORDERS.filter(w=>filter==="All"||w.status===filter);

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"10px 14px 0",flexShrink:0}}>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10}}>
          {filters.map(f=><button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?"#1a2d4a":"transparent",color:filter===f?"#7aacf0":T.dim,border:`1px solid ${filter===f?"rgba(59,130,246,0.28)":T.border}`,borderRadius:99,padding:"5px 14px",fontSize:12,fontWeight:filter===f?600:400,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",flexShrink:0}}>{f}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
          {[{label:"Open",value:ALL_WORK_ORDERS.filter(w=>w.status!=="Completed").length,color:T.blue},{label:"Ongoing",value:ALL_WORK_ORDERS.filter(w=>w.status==="Ongoing").length,color:T.green},{label:"On Hold",value:ALL_WORK_ORDERS.filter(w=>w.status==="On Hold").length,color:T.amber}].map(({label,value,color})=>(
            <div key={label} style={inner({padding:"10px 12px",textAlign:"center"})}><div style={{fontSize:22,fontWeight:800,color,letterSpacing:"-0.03em"}}>{value}</div><div style={{fontSize:10,color:T.dim,marginTop:2}}>{label}</div></div>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"0 14px 90px"}}>
        {filtered.map(wo=>{
          const procId=WO_PROCEDURES[wo.id];
          const proc=PROCEDURE_LIBRARY.find(p=>p.id===procId);
          return (
            <div key={wo.id} onClick={()=>setSelected(wo)} style={{...card({borderRadius:16,marginBottom:10,cursor:"pointer"})}}>
              <div style={{height:3,background:statusColor(wo.status),opacity:0.8}} />
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontSize:12,color:T.dim,fontFamily:"monospace"}}>{wo.id}</span>
                    <Badge label={wo.status}   color={statusColor(wo.status)} />
                    <Badge label={wo.priority} color={priorityColor(wo.priority)} />
                  </div>
                  <Avatar name={wo.tech} color={wo.color} size={30} />
                </div>
                <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:4}}>{wo.asset}</div>
                <div style={{fontSize:12,color:T.dim,fontWeight:300,marginBottom:10}}>📍 {wo.location}</div>
                {/* Procedure indicator */}
                <div style={{...inner({padding:"8px 10px",marginBottom:10}),display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <span style={{fontSize:12}}>📋</span>
                    <span style={{fontSize:11.5,color:proc?T.text:T.dim,fontWeight:proc?500:300}}>{proc?proc.name:"No procedure attached"}</span>
                  </div>
                  {proc&&<Badge label="Attached" color="#34d399" />}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                  {[{label:"Tech",value:wo.tech.split(" ")[0],col:T.muted},{label:"Due",value:wo.due.replace(", 2024",""),col:T.text},{label:"Cost",value:`$${wo.cost}`,col:T.text}].map(({label,value,col})=>(
                    <div key={label} style={inner({padding:"8px 10px"})}><div style={{fontSize:9.5,color:T.dim,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>{label}</div><div style={{fontSize:12,fontWeight:500,color:col,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value}</div></div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selected&&<MobileWOSheet wo={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE — Assets
═══════════════════════════════════════════════════════════════ */
function MobileAssets() {
  const [filter,  setFilter]  = useState("All");
  const [selected,setSelected]= useState(null);
  const filtered=ALL_ASSETS.filter(a=>filter==="All"||a.status===filter);
  const sc=s=>assetStatusColor(s);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"10px 14px 0",flexShrink:0}}>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10}}>
          {["All","Good","Alert","Critical"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?"#1a2d4a":"transparent",color:filter===f?"#7aacf0":T.dim,border:`1px solid ${filter===f?"rgba(59,130,246,0.28)":T.border}`,borderRadius:99,padding:"5px 14px",fontSize:12,fontWeight:filter===f?600:400,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",flexShrink:0}}>
            {f!=="All"&&<span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:sc(f),marginRight:5,verticalAlign:"middle"}} />}{f}
          </button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
          {[{label:"Good",v:ALL_ASSETS.filter(a=>a.status==="Good").length,c:"#34d399"},{label:"Alert",v:ALL_ASSETS.filter(a=>a.status==="Alert").length,c:"#fbbf24"},{label:"Critical",v:ALL_ASSETS.filter(a=>a.status==="Critical").length,c:"#f87171"}].map(({label,v,c})=>(
            <div key={label} style={inner({padding:"10px 12px",textAlign:"center"})}><div style={{fontSize:22,fontWeight:800,color:c,letterSpacing:"-0.03em"}}>{v}</div><div style={{fontSize:10,color:T.dim,marginTop:2}}>{label}</div></div>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"0 14px 90px"}}>
        {filtered.map(asset=>(
          <div key={asset.id} onClick={()=>setSelected(asset)} style={{...card({borderRadius:16,marginBottom:10,cursor:"pointer"})}}>
            <div style={{height:3,background:sc(asset.status),opacity:0.8}} />
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                <div style={{width:44,height:44,background:asset.color+"14",border:`1px solid ${asset.color}28`,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{asset.icon}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:2}}>{asset.name}</div><div style={{fontSize:11.5,color:T.dim,fontWeight:300}}>📍 {asset.location}</div></div>
                <Badge label={asset.status} color={sc(asset.status)} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                {[{l:"Uptime",v:`${asset.uptime}%`,c:asset.uptime>95?"#34d399":asset.uptime>80?"#fbbf24":"#f87171"},{l:"MTTR",v:`${asset.mttr}h`,c:T.muted},{l:"Open WOs",v:asset.openWO,c:asset.openWO>0?"#f87171":T.muted}].map(({l,v,c})=>(
                  <div key={l} style={{...inner({padding:"8px 10px",textAlign:"center"})}}><div style={{fontSize:14,fontWeight:700,color:c,letterSpacing:"-0.02em"}}>{v}</div><div style={{fontSize:9.5,color:T.dim,marginTop:1}}>{l}</div></div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                <div style={{display:"flex",gap:5}}><Badge label={asset.type} color={T.violet} /><Badge label={asset.criticality} color={asset.criticality==="High"?"#f87171":asset.criticality==="Medium"?"#fbbf24":"#34d399"} /></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:9.5,color:T.dim}}>Next PM</div><div style={{fontSize:11,fontWeight:600,color:T.muted}}>{asset.nextPM}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selected&&(
        <BottomSheet title={selected.name} onClose={()=>setSelected(null)}>
          <div style={{padding:"16px 18px 28px",display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <Badge label={selected.status}      color={sc(selected.status)} />
              <Badge label={selected.criticality} color={selected.criticality==="High"?"#f87171":selected.criticality==="Medium"?"#fbbf24":"#34d399"} />
              <Badge label={selected.type}        color={T.violet} />
            </div>
            <div style={inner({padding:"14px"})}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:11,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Uptime</span><span style={{fontSize:20,fontWeight:800,color:sc(selected.status),letterSpacing:"-0.03em"}}>{selected.uptime}%</span></div>
              <div style={{height:6,background:T.bg,borderRadius:99}}><div style={{width:`${selected.uptime}%`,height:"100%",background:sc(selected.status),borderRadius:99}} /></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{l:"Manufacturer",v:selected.manufacturer},{l:"Model",v:selected.model},{l:"Last PM",v:selected.lastPM},{l:"Next PM",v:selected.nextPM},{l:"Open WOs",v:selected.openWO},{l:"Asset Value",v:`$${selected.cost.toLocaleString()}`}].map(({l,v})=>(
                <div key={l} style={inner({padding:"10px 12px"})}><div style={{fontSize:9.5,color:T.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{l}</div><div style={{fontSize:12.5,fontWeight:500,color:T.text}}>{v}</div></div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:12,padding:"13px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✏ Edit</button>
              <button style={{background:T.raised,color:T.muted,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Create WO</button>
            </div>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE — Dashboard
═══════════════════════════════════════════════════════════════ */
function MobileDashboard() {
  return (
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"14px 14px 90px"}}>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4,marginBottom:14,scrollSnapType:"x mandatory"}}>
        {[{value:"18",label:"Open Orders",icon:"⚡",color:T.blue},{value:"7",label:"Scheduled",icon:"📅",color:T.violet},{value:"54",label:"Critical Assets",icon:"⚠️",color:T.amber},{value:"8",label:"Low Stock",icon:"📦",color:T.red}].map(({value,label,icon,color})=>(
          <div key={label} style={{...inner({padding:"14px 16px",borderRadius:16,flexShrink:0,minWidth:130,scrollSnapAlign:"start"}),borderColor:color+"22"}}>
            <div style={{fontSize:28,fontWeight:800,color,letterSpacing:"-0.04em",fontVariantNumeric:"tabular-nums"}}>{value}</div>
            <div style={{fontSize:11,color:T.muted,marginTop:5}}>{label}</div>
            <span style={{fontSize:20}}>{icon}</span>
          </div>
        ))}
      </div>
      <div style={{...card({borderRadius:18,marginBottom:12})}}>
        <div style={{padding:"14px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:600,fontSize:14}}>My Work Orders</span>
          <button style={{background:"#1a2d4a",color:"#7aacf0",border:"1px solid rgba(59,130,246,0.22)",borderRadius:8,padding:"5px 12px",fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ New</button>
        </div>
        <div style={{height:1,background:T.border}} />
        {DATA.workOrders.map((wo,i)=>(
          <div key={i}>
            <div style={{padding:"12px 16px",display:"flex",gap:12,alignItems:"center",cursor:"pointer"}} onTouchStart={e=>e.currentTarget.style.background=T.raised} onTouchEnd={e=>e.currentTarget.style.background=""}>
              <div style={{width:3,height:36,borderRadius:99,background:wo.color,flexShrink:0}} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}><span style={{fontSize:11,color:T.dim,fontFamily:"monospace"}}>{wo.id}</span><Badge label={wo.status} color={statusColor(wo.status)} /></div>
                <div style={{fontSize:13,fontWeight:500,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{wo.asset}</div>
                <div style={{fontSize:11,color:T.dim,marginTop:2,fontWeight:300}}>{wo.tech} · Due {wo.due}</div>
              </div>
              <Avatar name={wo.tech} color={wo.color} size={30} />
            </div>
            {i<DATA.workOrders.length-1&&<div style={{height:1,background:T.border,margin:"0 16px"}} />}
          </div>
        ))}
      </div>
      <div style={{...card({borderRadius:18,marginBottom:12}),padding:"14px 16px"}}>
        <div style={{fontWeight:600,fontSize:14,marginBottom:12}}>Asset Overview</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[{label:"Good",count:199,color:"#34d399"},{label:"Alert",count:55,color:"#fbbf24"},{label:"Critical",count:54,color:"#f87171"}].map(({label,count,color})=>(
            <div key={label} style={{...inner({padding:"12px 10px",textAlign:"center",borderRadius:12})}}>
              <div style={{fontSize:22,fontWeight:800,color,letterSpacing:"-0.03em"}}>{count}</div>
              <div style={{width:20,height:3,background:color,borderRadius:99,margin:"6px auto 4px"}} />
              <div style={{fontSize:10.5,color:T.dim}}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{...card({borderRadius:18})}}>
        <div style={{padding:"14px 16px 10px",fontWeight:600,fontSize:14}}>Upcoming Tasks</div>
        <div style={{height:1,background:T.border}} />
        {DATA.tasks.map((task,i)=>(
          <div key={i}>
            <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{...inner({width:38,height:38,borderRadius:11}),display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>📊</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{task.title}</div><div style={{fontSize:11,color:T.dim,fontWeight:300,marginTop:2}}>{task.sub} · {task.time}</div></div>
              <Badge label={task.tag} color={T.blue} />
            </div>
            {i<DATA.tasks.length-1&&<div style={{height:1,background:T.border,margin:"0 16px"}} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE — Shell
═══════════════════════════════════════════════════════════════ */
const MOB_NAV=[{icon:"▣",label:"Dashboard",key:"Dashboard"},{icon:"≡",label:"Work Orders",key:"Work Orders"},{icon:"◎",label:"Assets",key:"Assets"},{icon:"▦",label:"Inventory",key:"Inventory"},{icon:"◈",label:"Reports",key:"Reports"}];

function MobileTopbar({ title }) {
  const [showSearch,setShowSearch]=useState(false);
  const [q,setQ]=useState("");
  return (
    <header style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"0 16px",paddingTop:"env(safe-area-inset-top,12px)",flexShrink:0,zIndex:50}}>
      {showSearch?(
        <div style={{display:"flex",alignItems:"center",gap:10,height:52}}>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:8,...inner({padding:"9px 13px",borderRadius:12})}}>
            <span style={{color:T.dim,fontSize:14}}>⌕</span>
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" style={{background:"none",border:"none",outline:"none",color:T.text,fontSize:14,width:"100%",fontFamily:"inherit"}} />
          </div>
          <button onClick={()=>{setShowSearch(false);setQ("");}} style={{background:"none",border:"none",color:T.blue,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",padding:"4px 0"}}>Cancel</button>
        </div>
      ):(
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
          <span style={{fontSize:19,fontWeight:700,color:T.text,letterSpacing:"-0.03em"}}>{title}</span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setShowSearch(true)} style={{width:36,height:36,borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer"}}>⌕</button>
            <button style={{width:36,height:36,borderRadius:10,background:T.raised,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",position:"relative"}}>
              🔔<div style={{position:"absolute",top:4,right:4,width:8,height:8,background:T.red,borderRadius:"50%",border:`1.5px solid ${T.surface}`}} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileBottomNav({ active, setActive }) {
  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",paddingBottom:"env(safe-area-inset-bottom,8px)",zIndex:100}}>
      {MOB_NAV.map(({icon,label,key})=>{
        const on=active===key;
        return (
          <button key={key} onClick={()=>setActive(key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"10px 4px 6px",background:"none",border:"none",cursor:"pointer",color:on?T.blue:T.dim,fontFamily:"inherit",transition:"color 0.15s"}}>
            <span style={{fontSize:18,lineHeight:1}}>{icon}</span>
            <span style={{fontSize:9.5,fontWeight:on?600:400,letterSpacing:"0.01em"}}>{label}</span>
            {on&&<div style={{width:20,height:2,background:T.blue,borderRadius:99,marginTop:2}} />}
          </button>
        );
      })}
    </nav>
  );
}

function MobileApp() {
  const [activeNav,setActiveNav]=useState("Dashboard");
  const titles={Dashboard:"Dashboard","Work Orders":"Work Orders",Assets:"Assets",Inventory:"Inventory",Reports:"Reports"};
  const renderView=()=>{
    switch(activeNav){
      case "Work Orders": return <MobileWorkOrders />;
      case "Assets":      return <MobileAssets />;
      case "Inventory":   return <MobileInventory />;
      default:            return <MobileDashboard />;
    }
  };
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",height:"100dvh",background:T.bg,fontFamily:"'Poppins',sans-serif",color:T.text,WebkitFontSmoothing:"antialiased",overflow:"hidden"}}>
      <MobileTopbar title={titles[activeNav]} />
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>{renderView()}</div>
      <MobileBottomNav active={activeNav} setActive={setActiveNav} />
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   DESKTOP — Inventory Detail Panel
═══════════════════════════════════════════════════════════════ */
function InventoryDetailPanel({ item, onClose }) {
  const stockPct   = Math.min(100, Math.round((item.stock / item.maxStock) * 100));
  const stockColor = item.stock === 0 ? T.red : item.stock <= item.minStock ? T.amber : T.green;
  const stockLabel = item.stock === 0 ? "Out of Stock" : item.stock <= item.minStock ? "Low Stock" : "In Stock";
  return (
    <div style={{ width:340, background:T.surface, borderLeft:`1px solid ${T.border}`, display:"flex", flexDirection:"column", flexShrink:0, animation:"slideIn 0.22s cubic-bezier(.34,1.2,.64,1)" }}>
      {/* Header */}
      <div style={{ padding:"18px 20px 14px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, background:stockColor+"14", border:`1px solid ${stockColor}28`, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{item.icon}</div>
            <div>
              <div style={{ fontSize:10, color:T.dim, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:3 }}>{item.id}</div>
              <div style={{ fontSize:15, fontWeight:700, color:T.text, letterSpacing:"-0.02em", lineHeight:1.3 }}>{item.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:T.raised, border:`1px solid ${T.border}`, borderRadius:8, width:30, height:30, cursor:"pointer", color:T.muted, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit", flexShrink:0 }}>✕</button>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <Badge label={stockLabel}      color={stockColor} />
          <Badge label={item.category}   color={T.violet} />
          <Badge label={"PN: "+item.pn}  color={T.muted} />
        </div>
      </div>
      {/* Body */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
        {/* Stock card */}
        <div style={inner({ padding:"14px" })}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <div style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Current Stock</div>
              <div style={{ fontSize:36, fontWeight:800, color:stockColor, letterSpacing:"-0.04em", lineHeight:1 }}>{item.stock}</div>
              <div style={{ fontSize:11, color:T.dim, marginTop:3 }}>{item.unit} available</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Unit Cost</div>
              <div style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>{"$"+item.unitCost.toLocaleString()}</div>
              <div style={{ fontSize:11, color:T.dim, marginTop:3 }}>per {item.unit}</div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>Stock Level</span>
            <span style={{ fontSize:11, fontWeight:600, color:stockColor }}>{item.stock+" / "+item.maxStock+" "+item.unit}</span>
          </div>
          <div style={{ height:7, background:T.bg, borderRadius:99, overflow:"hidden" }}>
            <div style={{ width:stockPct+"%", height:"100%", background:stockColor, borderRadius:99, transition:"width 0.5s ease", boxShadow:"0 0 8px "+stockColor+"55" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            <span style={{ fontSize:10, color:T.dim }}>Min: {item.minStock}</span>
            <span style={{ fontSize:10, color:T.dim }}>Max: {item.maxStock}</span>
          </div>
        </div>
        {/* Info grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[
            { label:"Supplier",   value:item.supplier },
            { label:"Location",   value:item.location },
            { label:"Last Order", value:item.lastOrdered },
            { label:"Unit Type",  value:item.unit },
          ].map(({ label, value }) => (
            <div key={label} style={inner({ padding:"10px 12px" })}>
              <div style={{ fontSize:9.5, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:12, fontWeight:500, color:T.text }}>{value}</div>
            </div>
          ))}
        </div>
        {/* Linked asset */}
        {item.asset && (
          <div style={{ ...inner({ padding:"12px 14px" }), display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, background:"#a78bfa14", border:"1px solid #a78bfa28", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🔗</div>
            <div>
              <div style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>Linked Asset</div>
              <div style={{ fontSize:12.5, fontWeight:600, color:T.text }}>{item.asset}</div>
            </div>
          </div>
        )}
        {/* Reorder alert */}
        {item.stock <= item.minStock && (
          <div style={{ ...inner({ padding:"12px 14px" }), borderColor:stockColor+"44", background:stockColor+"08" }}>
            <div style={{ fontSize:11, fontWeight:600, color:stockColor, marginBottom:4 }}>
              {item.stock===0?"⚠ Out of Stock — Immediate Reorder Required":"⚠ Below Minimum — Reorder Recommended"}
            </div>
            <div style={{ fontSize:11, color:T.dim, fontWeight:300 }}>Suggested: {item.maxStock-item.stock} {item.unit} · Est. {"$"+((item.maxStock-item.stock)*item.unitCost).toLocaleString()}</div>
          </div>
        )}
        {/* Actions */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:4 }}>
          <button style={{ background:"#1a2d4a", color:"#7aacf0", border:"1px solid rgba(59,130,246,0.28)", borderRadius:12, padding:"10px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Reorder</button>
          <button style={{ background:"rgba(52,211,153,0.10)", color:"#34d399", border:"1px solid rgba(52,211,153,0.25)", borderRadius:12, padding:"10px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>↑ Adjust Stock</button>
          <button style={{ background:T.raised, color:T.muted, border:`1px solid ${T.border}`, borderRadius:12, padding:"10px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", gridColumn:"span 2" }}>Transaction History</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP — Inventory View
═══════════════════════════════════════════════════════════════ */
function InventoryView() {
  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [selected,    setSelected]    = useState(null);
  const [sortCol,     setSortCol]     = useState("name");
  const [sortDir,     setSortDir]     = useState(1);

  const stockStatus = i => i.stock===0?"Out of Stock":i.stock<=i.minStock?"Low Stock":"In Stock";
  const stockColor  = i => i.stock===0?T.red:i.stock<=i.minStock?T.amber:T.green;
  const cats = ["All",...Array.from(new Set(ALL_INVENTORY.map(i=>i.category))).sort()];
  const stockOpts = ["All","Out of Stock","Low Stock","In Stock"];

  const filtered = ALL_INVENTORY
    .filter(i => catFilter==="All" || i.category===catFilter)
    .filter(i => stockFilter==="All" || stockStatus(i)===stockFilter)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.pn.toLowerCase().includes(search.toLowerCase()) || i.supplier.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a,b)=>{
    const av=a[sortCol]??"", bv=b[sortCol]??"";
    return typeof av==="number"?(av-bv)*sortDir:String(av).localeCompare(String(bv))*sortDir;
  });

  const toggleSort = col => { if(sortCol===col) setSortDir(d=>-d); else { setSortCol(col); setSortDir(1); } };
  const arrow = col => sortCol===col?(sortDir===1?"↑":"↓"):"";

  const totalValue   = ALL_INVENTORY.reduce((a,i)=>a+i.stock*i.unitCost,0);
  const outOfStock   = ALL_INVENTORY.filter(i=>i.stock===0).length;
  const lowStock     = ALL_INVENTORY.filter(i=>i.stock>0&&i.stock<=i.minStock).length;
  const reorderValue = ALL_INVENTORY.filter(i=>i.stock<=i.minStock).reduce((a,i)=>a+(i.maxStock-i.stock)*i.unitCost,0);

  const COLS = [
    { key:"name",     label:"Part / Description", w:"200px" },
    { key:"pn",       label:"Part No.",           w:"90px"  },
    { key:"category", label:"Category",           w:"110px" },
    { key:"supplier", label:"Supplier",           w:"140px" },
    { key:"location", label:"Location",           w:"100px" },
    { key:"stock",    label:"Stock",              w:"90px"  },
    { key:"unitCost", label:"Unit Cost",          w:"90px"  },
    { key:"status",   label:"Status",             w:"110px" },
  ];

  return (
    <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Page header */}
        <div style={{ padding:"18px 22px 14px", flexShrink:0, borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div>
              <h2 style={{ fontSize:21, fontWeight:700, letterSpacing:"-0.03em", marginBottom:2 }}>Inventory</h2>
              <div style={{ fontSize:12, color:T.dim, fontWeight:300 }}>{ALL_INVENTORY.length} parts tracked · {"$"+totalValue.toLocaleString()} total value on hand</div>
            </div>
            <button style={{ background:"#1a2d4a", color:"#7aacf0", border:"1px solid rgba(59,130,246,0.28)", borderRadius:12, padding:"9px 18px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Add Part</button>
          </div>
          {/* KPI strip */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
            {[
              { label:"Total Parts",   value:ALL_INVENTORY.length,              color:T.blue,   icon:"▦" },
              { label:"Out of Stock",  value:outOfStock,                         color:T.red,    icon:"⚠" },
              { label:"Low Stock",     value:lowStock,                           color:T.amber,  icon:"▲" },
              { label:"Reorder Value", value:"$"+reorderValue.toLocaleString(), color:T.violet, icon:"↺" },
            ].map(({ label, value, color, icon }) => (
              <div key={label} style={inner({ padding:"12px 14px" })}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                  <span style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</span>
                  <span style={{ fontSize:13, color:color+"aa" }}>{icon}</span>
                </div>
                <div style={{ fontSize:22, fontWeight:800, color, letterSpacing:"-0.03em" }}>{value}</div>
              </div>
            ))}
          </div>
          {/* Filters row */}
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, ...inner({ padding:"7px 12px", borderRadius:10, minWidth:220 }) }}>
              <span style={{ color:T.dim, fontSize:13 }}>⌕</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search parts, PN, supplier…"
                style={{ background:"none", border:"none", outline:"none", color:T.text, fontSize:13, width:"100%", fontFamily:"inherit" }} />
              {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>✕</button>}
            </div>
            <div style={{ width:1, height:20, background:T.border }} />
            {stockOpts.map(s => {
              const col = s==="Out of Stock"?T.red:s==="Low Stock"?T.amber:s==="In Stock"?T.green:T.muted;
              return (
                <button key={s} onClick={()=>setStockFilter(s)}
                  style={{ background:stockFilter===s?"#1a2d4a":"transparent", color:stockFilter===s?"#7aacf0":T.dim, border:`1px solid ${stockFilter===s?"rgba(59,130,246,0.28)":T.border}`, borderRadius:8, padding:"5px 11px", fontSize:11.5, fontWeight:stockFilter===s?600:400, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
                  {s!=="All"&&<div style={{ width:6, height:6, borderRadius:"50%", background:col }}/>}{s}
                </button>
              );
            })}
            <div style={{ width:1, height:20, background:T.border }} />
            <div style={{ display:"flex", gap:4, overflowX:"auto", maxWidth:420 }}>
              {cats.map(c => (
                <button key={c} onClick={()=>setCatFilter(c)}
                  style={{ background:catFilter===c?"rgba(167,139,250,0.15)":"transparent", color:catFilter===c?"#a78bfa":T.dim, border:`1px solid ${catFilter===c?"rgba(167,139,250,0.3)":T.border}`, borderRadius:8, padding:"5px 11px", fontSize:11.5, fontWeight:catFilter===c?600:400, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex:1, overflowY:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:T.raised, position:"sticky", top:0, zIndex:1 }}>
                {COLS.map(c => (
                  <th key={c.key} onClick={()=>toggleSort(c.key)}
                    style={{ padding:"10px 14px", textAlign:"left", fontSize:10.5, fontWeight:600, color:T.dim, textTransform:"uppercase", letterSpacing:"0.07em", cursor:"pointer", whiteSpace:"nowrap", borderBottom:`1px solid ${T.border}`, userSelect:"none", width:c.w }}>
                    {c.label} <span style={{ color:T.blue, fontSize:10 }}>{arrow(c.key)}</span>
                  </th>
                ))}
                <th style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}`, width:"120px" }}/>
              </tr>
            </thead>
            <tbody>
              {sorted.map(item => {
                const sc  = stockColor(item);
                const ss  = stockStatus(item);
                const sel = selected?.id===item.id;
                const pct = Math.min(100, Math.round((item.stock/item.maxStock)*100));
                return (
                  <tr key={item.id} onClick={()=>setSelected(sel?null:item)}
                    style={{ borderBottom:`1px solid ${T.border}`, cursor:"pointer", background:sel?T.blueGlow:"transparent", borderLeft:sel?"3px solid "+T.blue:"3px solid transparent", transition:"background 0.15s" }}
                    onMouseEnter={e=>{ if(!sel) e.currentTarget.style.background=T.raised; }}
                    onMouseLeave={e=>{ if(!sel) e.currentTarget.style.background="transparent"; }}>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, background:sc+"14", border:`1px solid ${sc}28`, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{item.icon}</div>
                        <div>
                          <div style={{ fontWeight:600, color:T.text, marginBottom:1 }}>{item.name}</div>
                          <div style={{ fontSize:10.5, color:T.dim, fontWeight:300 }}>{item.location}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11.5, color:T.muted, background:T.raised, border:`1px solid ${T.border}`, borderRadius:5, padding:"2px 6px" }}>{item.pn}</span></td>
                    <td style={{ padding:"12px 14px" }}><Badge label={item.category} color={T.violet}/></td>
                    <td style={{ padding:"12px 14px", color:T.muted, fontSize:12 }}>{item.supplier}</td>
                    <td style={{ padding:"12px 14px", color:T.dim, fontSize:12 }}>{item.location}</td>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ fontWeight:700, color:sc, fontSize:15, letterSpacing:"-0.02em", marginBottom:4 }}>
                        {item.stock}<span style={{ fontSize:10, color:T.dim, fontWeight:400, marginLeft:3 }}>{item.unit}</span>
                      </div>
                      <div style={{ width:60, height:4, background:T.bg, borderRadius:99, overflow:"hidden" }}>
                        <div style={{ width:pct+"%", height:"100%", background:sc, borderRadius:99 }}/>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px", fontWeight:600, color:T.text }}>{"$"+item.unitCost.toLocaleString()}</td>
                    <td style={{ padding:"12px 14px" }}><Badge label={ss} color={sc}/></td>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", gap:5 }}>
                        <button onClick={e=>{e.stopPropagation();setSelected(sel?null:item);}} style={{ background:"#1a2d4a", color:"#7aacf0", border:"1px solid rgba(59,130,246,0.22)", borderRadius:7, padding:"4px 10px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>View</button>
                        {item.stock<=item.minStock && <button onClick={e=>e.stopPropagation()} style={{ background:"rgba(251,191,36,0.12)", color:"#fbbf24", border:"1px solid rgba(251,191,36,0.25)", borderRadius:7, padding:"4px 10px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Reorder</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sorted.length===0 && (
            <div style={{ padding:"60px 0", textAlign:"center", color:T.dim }}>
              <div style={{ fontSize:32, marginBottom:10 }}>📦</div>
              <div style={{ fontSize:14, fontWeight:500 }}>No parts match your filters</div>
            </div>
          )}
        </div>
      </div>
      {selected && <InventoryDetailPanel item={selected} onClose={()=>setSelected(null)}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE — Inventory
═══════════════════════════════════════════════════════════════ */
function MobileInventory() {
  const [stockFilter,setStockFilter] = useState("All");
  const [catFilter,  setCatFilter]   = useState("All");
  const [selected,   setSelected]    = useState(null);

  const stockStatus = i => i.stock===0?"Out of Stock":i.stock<=i.minStock?"Low Stock":"In Stock";
  const stockColor  = i => i.stock===0?T.red:i.stock<=i.minStock?T.amber:T.green;
  const cats = ["All",...Array.from(new Set(ALL_INVENTORY.map(i=>i.category))).sort()];

  const filtered = ALL_INVENTORY
    .filter(i => stockFilter==="All" || stockStatus(i)===stockFilter)
    .filter(i => catFilter==="All" || i.category===catFilter);

  const outOfStock = ALL_INVENTORY.filter(i=>i.stock===0).length;
  const lowStock   = ALL_INVENTORY.filter(i=>i.stock>0&&i.stock<=i.minStock).length;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"10px 14px 0", flexShrink:0 }}>
        {/* Stock status filter pills */}
        <div style={{ display:"flex", gap:5, overflowX:"auto", paddingBottom:6 }}>
          {["All","Out of Stock","Low Stock","In Stock"].map(f => {
            const col = f==="Out of Stock"?T.red:f==="Low Stock"?T.amber:f==="In Stock"?T.green:T.muted;
            return (
              <button key={f} onClick={()=>setStockFilter(f)}
                style={{ background:stockFilter===f?"#1a2d4a":"transparent", color:stockFilter===f?"#7aacf0":T.dim, border:`1px solid ${stockFilter===f?"rgba(59,130,246,0.28)":T.border}`, borderRadius:99, padding:"5px 13px", fontSize:12, fontWeight:stockFilter===f?600:400, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", flexShrink:0, display:"flex", alignItems:"center", gap:5 }}>
                {f!=="All" && <div style={{ width:6, height:6, borderRadius:"50%", background:col }}/>}
                {f}
              </button>
            );
          })}
        </div>
        {/* Category pills */}
        <div style={{ display:"flex", gap:5, overflowX:"auto", paddingBottom:10 }}>
          {cats.map(c => (
            <button key={c} onClick={()=>setCatFilter(c)}
              style={{ background:catFilter===c?"rgba(167,139,250,0.15)":"transparent", color:catFilter===c?"#a78bfa":T.dim, border:`1px solid ${catFilter===c?"rgba(167,139,250,0.3)":T.border}`, borderRadius:99, padding:"4px 11px", fontSize:11, fontWeight:catFilter===c?600:400, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", flexShrink:0 }}>
              {c}
            </button>
          ))}
        </div>
        {/* KPI strip */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
          {[
            { label:"Total Parts",  value:ALL_INVENTORY.length, color:T.blue  },
            { label:"Out of Stock", value:outOfStock,            color:T.red   },
            { label:"Low Stock",    value:lowStock,              color:T.amber },
          ].map(({ label, value, color }) => (
            <div key={label} style={inner({ padding:"10px 12px", textAlign:"center" })}>
              <div style={{ fontSize:22, fontWeight:800, color, letterSpacing:"-0.03em" }}>{value}</div>
              <div style={{ fontSize:10, color:T.dim, marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Parts list */}
      <div style={{ flex:1, overflowY:"auto", WebkitOverflowScrolling:"touch", padding:"0 14px 90px" }}>
        {filtered.map(item => {
          const sc  = stockColor(item);
          const ss  = stockStatus(item);
          const pct = Math.min(100, Math.round((item.stock/item.maxStock)*100));
          return (
            <div key={item.id} onClick={()=>setSelected(item)} style={{ ...card({ borderRadius:16, marginBottom:10, cursor:"pointer" }) }}>
              <div style={{ height:3, background:sc, opacity:0.8 }}/>
              <div style={{ padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:10 }}>
                  <div style={{ width:42, height:42, background:sc+"14", border:`1px solid ${sc}28`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{item.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:600, color:T.text, marginBottom:3, lineHeight:1.3 }}>{item.name}</div>
                    <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                      <span style={{ fontSize:10.5, fontFamily:"monospace", color:T.dim, background:T.raised, border:`1px solid ${T.border}`, borderRadius:4, padding:"1px 5px" }}>{item.pn}</span>
                      <Badge label={item.category} color={T.violet}/>
                    </div>
                  </div>
                  <Badge label={ss} color={sc}/>
                </div>
                {/* Stock bar */}
                <div style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>Stock</span>
                    <span style={{ fontSize:14, fontWeight:800, color:sc, letterSpacing:"-0.02em" }}>{item.stock} <span style={{ fontSize:10, fontWeight:400, color:T.dim }}>/ {item.maxStock} {item.unit}</span></span>
                  </div>
                  <div style={{ height:5, background:T.bg, borderRadius:99, overflow:"hidden" }}>
                    <div style={{ width:pct+"%", height:"100%", background:sc, borderRadius:99, transition:"width 0.4s ease" }}/>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
                    <span style={{ fontSize:9.5, color:T.dim }}>Min: {item.minStock}</span>
                    <span style={{ fontSize:9.5, color:T.dim }}>Max: {item.maxStock}</span>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:8, borderTop:`1px solid ${T.border}` }}>
                  <div>
                    <div style={{ fontSize:9.5, color:T.dim }}>Unit Cost</div>
                    <div style={{ fontSize:14, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>{"$"+item.unitCost.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:9.5, color:T.dim }}>Supplier</div>
                    <div style={{ fontSize:11.5, fontWeight:500, color:T.muted }}>{item.supplier}</div>
                  </div>
                  {item.stock<=item.minStock && (
                    <button onClick={e=>e.stopPropagation()} style={{ background:"#1a2d4a", color:"#7aacf0", border:"1px solid rgba(59,130,246,0.28)", borderRadius:10, padding:"7px 13px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Reorder</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && (
          <div style={{ padding:"50px 0", textAlign:"center", color:T.dim }}>
            <div style={{ fontSize:32, marginBottom:8 }}>📦</div>
            <div style={{ fontSize:14 }}>No parts match your filters</div>
          </div>
        )}
      </div>

      {/* Detail bottom sheet */}
      {selected && (
        <BottomSheet title={selected.name} onClose={()=>setSelected(null)}>
          <div style={{ padding:"16px 18px 28px", display:"flex", flexDirection:"column", gap:10 }}>
            {(()=>{
              const sc  = stockColor(selected);
              const ss  = stockStatus(selected);
              const pct = Math.min(100, Math.round((selected.stock/selected.maxStock)*100));
              return (<>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <Badge label={ss}               color={sc}/>
                  <Badge label={selected.category} color={T.violet}/>
                  <Badge label={"PN: "+selected.pn} color={T.muted}/>
                </div>
                <div style={inner({ padding:"14px" })}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div>
                      <div style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>Current Stock</div>
                      <div style={{ fontSize:34, fontWeight:800, color:sc, letterSpacing:"-0.04em", lineHeight:1 }}>{selected.stock}</div>
                      <div style={{ fontSize:11, color:T.dim, marginTop:3 }}>{selected.unit} available</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:10, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>Unit Cost</div>
                      <div style={{ fontSize:20, fontWeight:700, color:T.text }}>{"$"+selected.unitCost.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ height:6, background:T.bg, borderRadius:99, overflow:"hidden", marginBottom:5 }}>
                    <div style={{ width:pct+"%", height:"100%", background:sc, borderRadius:99 }}/>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:10, color:T.dim }}>Min: {selected.minStock}</span>
                    <span style={{ fontSize:10, color:T.dim }}>{selected.stock} / {selected.maxStock} {selected.unit}</span>
                    <span style={{ fontSize:10, color:T.dim }}>Max: {selected.maxStock}</span>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { label:"Supplier",   value:selected.supplier },
                    { label:"Location",   value:selected.location },
                    { label:"Last Order", value:selected.lastOrdered },
                    { label:"Unit",       value:selected.unit },
                  ].map(({ label, value }) => (
                    <div key={label} style={inner({ padding:"10px 12px" })}>
                      <div style={{ fontSize:9.5, color:T.dim, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>{label}</div>
                      <div style={{ fontSize:12.5, fontWeight:500, color:T.text }}>{value}</div>
                    </div>
                  ))}
                </div>
                {selected.stock<=selected.minStock && (
                  <div style={{ ...inner({ padding:"12px 14px" }), borderColor:sc+"44", background:sc+"08" }}>
                    <div style={{ fontSize:11, fontWeight:600, color:sc, marginBottom:3 }}>{selected.stock===0?"⚠ Out of Stock":"⚠ Below Minimum"}</div>
                    <div style={{ fontSize:11, color:T.dim, fontWeight:300 }}>Reorder: {selected.maxStock-selected.stock} {selected.unit} · {"$"+((selected.maxStock-selected.stock)*selected.unitCost).toLocaleString()}</div>
                  </div>
                )}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <button style={{ background:"#1a2d4a", color:"#7aacf0", border:"1px solid rgba(59,130,246,0.28)", borderRadius:12, padding:"12px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Reorder</button>
                  <button style={{ background:"rgba(52,211,153,0.10)", color:"#34d399", border:"1px solid rgba(52,211,153,0.25)", borderRadius:12, padding:"12px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>↑ Adjust</button>
                </div>
              </>);
            })()}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const isMobile=useIsMobile();
  const [activeNav,setActiveNav]=useState("Dashboard");

  if (isMobile) {
    return (
      <>
        <GlobalStyle />
        <style>{`html,body{height:100%;overflow:hidden;} *{-webkit-tap-highlight-color:transparent;}`}</style>
        <MobileApp />
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <div style={{display:"flex",height:"100vh",background:T.bg,fontFamily:"'Poppins',sans-serif",color:T.text,overflow:"hidden",WebkitFontSmoothing:"antialiased"}}>
        <Sidebar active={activeNav} setActive={setActiveNav} />
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          <Topbar />
          {activeNav==="Work Orders"?<WorkOrdersView />:
           activeNav==="Assets"?<AssetsView />:
           activeNav==="Inventory"?<InventoryView />:(
            <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}><DashboardView /></div>
          )}
        </div>
      </div>
    </>
  );
}

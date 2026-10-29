'use client';

import { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, ChartNoAxesCombined, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, CreditCard, Download, LayoutDashboard, LogOut, Menu, Plus, Search, Settings, ShieldCheck, Wallet, X } from 'lucide-react';

type AccountType = 'Savings' | 'Current' | 'Salary';
type Account = { id: string; name: string; number: string; type: AccountType; balance: number };
type Transaction = { id: string; accountId: string; description: string; date: string; amount: number; type: 'credit' | 'debit'; status: 'successful' | 'pending' | 'failed'; reference: string };
type Tab = 'Overview' | 'Accounts' | 'Transactions';

const initialAccounts: Account[] = [
  { id: 'acc-savings', name: 'Savings Account', number: '•••• 4829', type: 'Savings', balance: 24850.75 },
  { id: 'acc-current', name: 'Current Account', number: '•••• 1936', type: 'Current', balance: 12740.2 },
  { id: 'acc-salary', name: 'Salary Account', number: '•••• 8051', type: 'Salary', balance: 53600.0 },
];
const initialTransactions: Transaction[] = [
  { id: 'tx1', accountId: 'acc-savings', description: 'Monthly salary', date: '2026-10-27', amount: 62500, type: 'credit', status: 'successful', reference: 'BF-872410' },
  { id: 'tx2', accountId: 'acc-current', description: 'Amazon Marketplace', date: '2026-10-26', amount: 2499, type: 'debit', status: 'successful', reference: 'BF-872409' },
  { id: 'tx3', accountId: 'acc-savings', description: 'Electricity bill', date: '2026-10-25', amount: 1850, type: 'debit', status: 'successful', reference: 'BF-872408' },
  { id: 'tx4', accountId: 'acc-salary', description: 'Interest earned', date: '2026-10-24', amount: 420, type: 'credit', status: 'successful', reference: 'BF-872407' },
  { id: 'tx5', accountId: 'acc-current', description: 'Coffee House', date: '2026-10-23', amount: 385, type: 'debit', status: 'successful', reference: 'BF-872406' },
  { id: 'tx6', accountId: 'acc-savings', description: 'Online transfer', date: '2026-10-22', amount: 1200, type: 'debit', status: 'pending', reference: 'BF-872405' },
  { id: 'tx7', accountId: 'acc-salary', description: 'Grocery Store', date: '2026-10-21', amount: 1760, type: 'debit', status: 'successful', reference: 'BF-872404' },
  { id: 'tx8', accountId: 'acc-current', description: 'Refund - Fashion Hub', date: '2026-10-20', amount: 899, type: 'credit', status: 'successful', reference: 'BF-872403' },
  { id: 'tx9', accountId: 'acc-savings', description: 'Internet bill', date: '2026-10-18', amount: 799, type: 'debit', status: 'failed', reference: 'BF-872402' },
  { id: 'tx10', accountId: 'acc-salary', description: 'Food delivery', date: '2026-10-16', amount: 540, type: 'debit', status: 'successful', reference: 'BF-872401' },
  { id: 'tx11', accountId: 'acc-current', description: 'Freelance payment', date: '2026-10-14', amount: 8500, type: 'credit', status: 'successful', reference: 'BF-872400' },
  { id: 'tx12', accountId: 'acc-savings', description: 'Pharmacy', date: '2026-10-12', amount: 620, type: 'debit', status: 'successful', reference: 'BF-872399' },
];
const money = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
const dateLabel = (s: string) => new Date(`${s}T12:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

function Brand() { return <div className="brand"><span className="brand-mark"><Wallet size={19}/></span><span>BankFlow</span></div>; }

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [tab, setTab] = useState<Tab>('Overview');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [transferOpen, setTransferOpen] = useState(false);
  const [sourceId, setSourceId] = useState(initialAccounts[0].id);
  const [destinationId, setDestinationId] = useState(initialAccounts[1].id);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('Personal transfer');
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const pageSize = 5;

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const filteredTransactions = useMemo(() => {
    let rows = transactions.filter(tx => selectedAccount === 'all' || tx.accountId === selectedAccount);
    rows = rows.filter(tx => tx.description.toLowerCase().includes(query.toLowerCase().trim()));
    if (typeFilter !== 'all') rows = rows.filter(tx => tx.type === typeFilter);
    if (statusFilter !== 'all') rows = rows.filter(tx => tx.status === statusFilter);
    rows = [...rows].sort((a, b) => sortBy === 'date-desc' ? b.date.localeCompare(a.date) : sortBy === 'date-asc' ? a.date.localeCompare(b.date) : sortBy === 'amount-desc' ? b.amount - a.amount : a.amount - b.amount);
    return rows;
  }, [transactions, selectedAccount, query, typeFilter, statusFilter, sortBy]);
  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const income = transactions.filter(t => t.type === 'credit' && t.status === 'successful' && t.date.startsWith('2026-10')).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'debit' && t.status === 'successful' && t.date.startsWith('2026-10')).reduce((s, t) => s + t.amount, 0);

  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) { setLoginError('Enter a valid email address.'); return; }
    if (password.length < 4) { setLoginError('Password must contain at least 4 characters.'); return; }
    setLoginError(''); setLoggedIn(true);
  }
  function resetFilters() { setQuery(''); setTypeFilter('all'); setStatusFilter('all'); setSortBy('date-desc'); setSelectedAccount('all'); setPage(1); }
  function startTransfer() { setTransferSuccess(''); setTransferError(''); setConfirmTransfer(false); setAmount(''); setTransferOpen(true); }
  function submitTransfer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setTransferError(''); setTransferSuccess('');
    const value = Number(amount);
    const source = accounts.find(a => a.id === sourceId);
    const destination = accounts.find(a => a.id === destinationId);
    if (!source || !destination) { setTransferError('Select valid accounts.'); return; }
    if (sourceId === destinationId) { setTransferError('Source and destination accounts must be different.'); return; }
    if (!Number.isFinite(value) || value <= 0) { setTransferError('Enter an amount greater than zero.'); return; }
    if (value > source.balance) { setTransferError('Insufficient balance in the source account.'); return; }
    setConfirmTransfer(true);
  }
  function confirmMoneyTransfer() {
    const value = Number(amount);
    const source = accounts.find(a => a.id === sourceId);
    const destination = accounts.find(a => a.id === destinationId);
    if (!source || !destination || sourceId === destinationId || value <= 0 || value > source.balance) {
      setTransferError('Transfer could not be completed. Please review the details and available balance.'); setConfirmTransfer(false); return;
    }
    setAccounts(prev => prev.map(a => a.id === sourceId ? { ...a, balance: a.balance - value } : a.id === destinationId ? { ...a, balance: a.balance + value } : a));
    const today = new Date().toISOString().slice(0, 10);
    const ref = `BF-${Math.floor(100000 + Math.random() * 900000)}`;
    setTransactions(prev => [
      { id: `tx-${Date.now()}-d`, accountId: sourceId, description: memo.trim() || `Transfer to ${destination.name}`, date: today, amount: value, type: 'debit', status: 'successful', reference: `${ref}-D` },
      { id: `tx-${Date.now()}-c`, accountId: destinationId, description: `Transfer from ${source.name}`, date: today, amount: value, type: 'credit', status: 'successful', reference: `${ref}-C` },
      ...prev,
    ]);
    setConfirmTransfer(false); setTransferOpen(false); setTab('Overview'); setSelectedAccount('all'); setTransferSuccess(`Transfer of ${money(value)} completed successfully.`);
  }
  function nav(next: Tab) { setTab(next); setMobileNav(false); if (next === 'Transactions') setSelectedAccount('all'); }

  if (!loggedIn) return <main className="login-page">
    <section className="login-aside"><Brand/><div><div className="eyebrow" style={{ color: '#b7c7ff' }}>YOUR MONEY, IN MOTION</div><h1>Banking that moves at your pace.</h1><p>See the bigger picture, keep track of every transaction, and manage your money from one simple dashboard.</p></div><small style={{ color: '#c3cfee', fontSize: 11 }}>A fictional banking demo · Secure experience concept</small></section>
    <section className="login-main"><form className="login-form" onSubmit={login} noValidate><div className="eyebrow">WELCOME BACK</div><h2>Sign in to BankFlow</h2><p>Enter your details to access your dashboard.</p>
      <label className="form-field">Email address<input className="field" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} aria-label="Email address"/></label>
      <label className="form-field">Password<input className="field" type="password" autoComplete="current-password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} aria-label="Password"/></label>
      {loginError && <div className="notice error" role="alert">{loginError}</div>}
      <button className="btn" type="submit">Sign in <ChevronRight size={16}/></button>
      <div className="demo-note"><strong>Demo access:</strong> Use any valid-looking email and a password of at least 4 characters. No credentials are sent or stored. Do not enter real banking credentials.</div>
    </form></section>
  </main>;

  const navItems: { name: Tab; icon: React.ReactNode }[] = [{ name: 'Overview', icon: <LayoutDashboard size={17}/> }, { name: 'Accounts', icon: <CreditCard size={17}/> }, { name: 'Transactions', icon: <ArrowLeftRight size={17}/> }];
  return <div className="app-shell">
    <aside className="sidebar"><Brand/><div><div className="nav-label">WORKSPACE</div>{navItems.map(item => <button key={item.name} className={`nav-item ${tab === item.name ? 'active' : ''}`} onClick={() => nav(item.name)}>{item.icon}{item.name}</button>)}</div><div><div className="nav-label">PREFERENCES</div><button className="nav-item" onClick={() => alert('Settings are not connected in this demo.')}><Settings size={17}/> Settings</button><button className="nav-item" onClick={() => alert('Help centre is not connected in this demo.')}><CircleHelp size={17}/> Help centre</button></div><div className="side-bottom"><ShieldCheck size={18}/><div><strong style={{ color: '#3c4b67' }}>Demo environment</strong><br/>All account data is fictional and held in browser memory.</div></div></aside>
    <main className="main"><header className="topbar"><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><button className="btn secondary mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(!mobileNav)}><Menu size={16}/></button><div className="crumb">Workspace <span style={{ margin: '0 7px' }}>/</span><strong style={{ color: '#34425d' }}>{tab}</strong></div></div><div className="profile"><button className="btn secondary" aria-label="Notifications" onClick={() => alert('You are all caught up.')}><Bell size={16}/></button><div className="avatar">{email.slice(0, 1).toUpperCase() || 'A'}</div><span>{email.split('@')[0]}</span><button aria-label="Account menu" className="btn secondary" onClick={() => { setLoggedIn(false); setPassword(''); }}><LogOut size={15}/></button></div></header>
      {mobileNav && <div style={{ background: 'white', padding: 12, borderBottom: '1px solid var(--line)' }}>{navItems.map(item => <button key={item.name} className={`nav-item ${tab === item.name ? 'active' : ''}`} onClick={() => nav(item.name)}>{item.icon}{item.name}</button>)}</div>}
      <div className="content"><div className="page-heading"><div><div className="eyebrow">MONDAY, OCTOBER 29, 2026</div><h1>{tab === 'Overview' ? 'Good to see you again' : tab === 'Accounts' ? 'Your accounts' : 'Transaction history'}</h1><p className="subtitle">{tab === 'Overview' ? 'Here’s what’s happening with your money today.' : tab === 'Accounts' ? 'View balances and activity across your linked accounts.' : 'Search, filter and review your account activity.'}</p></div><button className="btn" onClick={startTransfer}><ArrowLeftRight size={16}/> Transfer money</button></div>
      {transferSuccess && <div className="notice success" role="status">{transferSuccess}<button style={{ float: 'right', border: 0, background: 'transparent', color: 'inherit' }} onClick={() => setTransferSuccess('')} aria-label="Dismiss"><X size={14}/></button></div>}
      <section className="stats"><div className="card"><div className="stat-top"><span>Total balance</span><span className="stat-icon"><Wallet size={17}/></span></div><div className="stat-value">{money(totalBalance)}</div><div className="stat-note">Across {accounts.length} linked accounts</div></div><div className="card"><div className="stat-top"><span>Monthly income</span><span className="stat-icon" style={{ background: '#e7f8f0', color: '#15966b' }}><ArrowDownLeft size={17}/></span></div><div className="stat-value">{money(income)}</div><div className="stat-note green">Credits received in October</div></div><div className="card"><div className="stat-top"><span>Monthly expenses</span><span className="stat-icon" style={{ background: '#fff0f1', color: '#d64b5b' }}><ArrowUpRight size={17}/></span></div><div className="stat-value">{money(expenses)}</div><div className="stat-note">Successful debits in October</div></div><div className="card"><div className="stat-top"><span>Transactions</span><span className="stat-icon" style={{ background: '#fff4df', color: '#b98013' }}><ChartNoAxesCombined size={17}/></span></div><div className="stat-value">{transactions.length}</div><div className="stat-note">All recorded activities</div></div></section>
      {tab === 'Overview' && <><div className="grid-main"><section className="card balance-hero"><div className="card-head"><div><h2 className="card-title">Total available balance</h2><div className="card-caption">Your combined account balance</div></div><Wallet size={20}/></div><div className="hero-amount">{money(totalBalance)}</div><div style={{ fontSize: 11, color: '#d2daf0' }}>Updated just now · Mock account data</div><div className="hero-actions"><button className="btn" onClick={startTransfer}><ArrowLeftRight size={15}/> Transfer</button><button className="btn secondary" onClick={() => nav('Transactions')}><Download size={15}/> View activity</button></div></section>
        <section className="card"><div className="card-head"><div><h2 className="card-title">My accounts</h2><div className="card-caption">Your linked bank accounts</div></div><button className="btn secondary" onClick={() => nav('Accounts')}>View all <ChevronRight size={14}/></button></div><div className="accounts-list">{accounts.map(a => <button key={a.id} className="account-row" style={{ border: 0, background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => { setSelectedAccount(a.id); setTab('Transactions'); setPage(1); }}><span className="account-icon"><CreditCard size={17}/></span><span className="account-meta"><span className="account-name" style={{ display: 'block' }}>{a.name}</span><span className="account-number">{a.number} · {a.type}</span></span><span className="account-balance">{money(a.balance)}</span></button>)}</div></section></div>
        <div className="grid-main"><section className="card"><div className="card-head"><div><h2 className="card-title">Cash flow</h2><div className="card-caption">Illustrative monthly income and expenses</div></div><span className="pill successful">October 2026</span></div><div className="chart">{[{m:'May',i:62,e:39},{m:'Jun',i:77,e:47},{m:'Jul',i:54,e:43},{m:'Aug',i:86,e:55},{m:'Sep',i:72,e:48},{m:'Oct',i:94,e:58}].map(d => <div className="chart-col" key={d.m}><div className="bar-wrap"><div className="bar income" style={{ height: `${d.i}%` }} title="Income"/><div className="bar expense" style={{ height: `${d.e}%` }} title="Expenses"/></div><span className="chart-label">{d.m}</span></div>)}</div><div className="legend"><span><i className="dot" style={{ background: '#cbd6ff' }}/ >Income</span><span><i className="dot" style={{ background: 'var(--blue)' }}/>Expenses</span></div></section>
        <section className="card"><div className="card-head"><div><h2 className="card-title">Quick actions</h2><div className="card-caption">Common things you can do</div></div></div><div className="accounts-list"><button className="account-row" style={{ border: 0, background: 'transparent', width: '100%', textAlign: 'left' }} onClick={startTransfer}><span className="account-icon"><ArrowLeftRight size={17}/></span><span className="account-meta"><span className="account-name" style={{ display: 'block' }}>Transfer between accounts</span><span className="account-number">Move funds between your accounts</span></span><ChevronRight size={16}/></button><button className="account-row" style={{ border: 0, background: 'transparent', width: '100%', textAlign: 'left' }} onClick={() => nav('Transactions')}><span className="account-icon"><Search size={17}/></span><span className="account-meta"><span className="account-name" style={{ display: 'block' }}>Find a transaction</span><span className="account-number">Search your recent activity</span></span><ChevronRight size={16}/></button></div></section></div>
        <TransactionTable rows={transactions.slice(0, 5)} title="Recent transactions" subtitle="Your latest account activity" onViewAll={() => nav('Transactions')} compact/></>}
      {tab === 'Accounts' && <section className="card"><div className="card-head"><div><h2 className="card-title">All linked accounts</h2><div className="card-caption">Select an account to view its transaction history</div></div><span className="pill successful">{accounts.length} accounts</span></div><div className="accounts-list">{accounts.map(a => <div className="account-row" key={a.id}><span className="account-icon"><CreditCard size={18}/></span><div className="account-meta"><div className="account-name">{a.name}</div><div className="account-number">{a.type} account · {a.number}</div></div><div style={{ textAlign: 'right' }}><div className="account-balance">{money(a.balance)}</div><button className="btn secondary" style={{ marginTop: 7, padding: '7px 9px' }} onClick={() => { setSelectedAccount(a.id); setTab('Transactions'); setPage(1); }}>View transactions</button></div></div>)}</div></section>}
      {tab === 'Transactions' && <TransactionTable rows={visibleTransactions} title="All transactions" subtitle={`${filteredTransactions.length} matching records`} onViewAll={resetFilters} filters={{ query, setQuery, typeFilter, setTypeFilter, statusFilter, setStatusFilter, sortBy, setSortBy, selectedAccount, setSelectedAccount, accounts, reset: resetFilters }} pagination={{ currentPage, pageCount, setPage }}/ >}
      <footer style={{ color: '#97a1b1', fontSize: 10, textAlign: 'center', marginTop: 25 }}>BankFlow is a fictional demo. No real financial transactions are processed.</footer>
      </div></main>
    {transferOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setTransferOpen(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="transfer-title"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}><div><h2 id="transfer-title">Transfer money</h2><div className="modal-sub">Move funds between your own accounts.</div></div><button className="btn secondary" aria-label="Close transfer" onClick={() => setTransferOpen(false)}><X size={16}/></button></div>
      {!confirmTransfer ? <form onSubmit={submitTransfer}><label className="form-field">From account<select className="select" value={sourceId} onChange={e => setSourceId(e.target.value)}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.number}) — {money(a.balance)}</option>)}</select></label><label className="form-field">To account<select className="select" value={destinationId} onChange={e => setDestinationId(e.target.value)}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.number})</option>)}</select></label><label className="form-field">Amount (INR)<input className="field" type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}/></label><label className="form-field">Description (optional)<input className="field" maxLength={70} value={memo} onChange={e => setMemo(e.target.value)} placeholder="What is this transfer for?"/></label>{transferError && <div className="notice error" role="alert">{transferError}</div>}<div className="modal-actions"><button type="button" className="btn secondary" onClick={() => setTransferOpen(false)}>Cancel</button><button type="submit" className="btn">Review transfer <ChevronRight size={15}/></button></div></form> : <><div style={{ background: '#f7f9fd', padding: 16, borderRadius: 12 }}><div className="card-caption">You are about to transfer</div><div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 17px' }}>{money(Number(amount))}</div><div style={{ fontSize: 12, marginBottom: 9 }}><span style={{ color: 'var(--muted)' }}>From: </span><strong>{accounts.find(a => a.id === sourceId)?.name}</strong></div><div style={{ fontSize: 12, marginBottom: 9 }}><span style={{ color: 'var(--muted)' }}>To: </span><strong>{accounts.find(a => a.id === destinationId)?.name}</strong></div><div style={{ fontSize: 12 }}><span style={{ color: 'var(--muted)' }}>Description: </span>{memo || 'Personal transfer'}</div></div>{transferError && <div className="notice error" role="alert">{transferError}</div>}<div className="modal-actions"><button className="btn secondary" onClick={() => setConfirmTransfer(false)}>Back</button><button className="btn" onClick={confirmMoneyTransfer}>Confirm transfer</button></div></>}
    </section></div>}
  </div>;
}

type Filters = { query: string; setQuery: (v: string) => void; typeFilter: string; setTypeFilter: (v: string) => void; statusFilter: string; setStatusFilter: (v: string) => void; sortBy: string; setSortBy: (v: string) => void; selectedAccount: string; setSelectedAccount: (v: string) => void; accounts: Account[]; reset: () => void };
type Pagination = { currentPage: number; pageCount: number; setPage: (v: number) => void };
function TransactionTable({ rows, title, subtitle, onViewAll, compact = false, filters, pagination }: { rows: Transaction[]; title: string; subtitle: string; onViewAll: () => void; compact?: boolean; filters?: Filters; pagination?: Pagination }) {
  return <section className="card table-card"><div className="table-top"><div className="card-head" style={{ marginBottom: 0 }}><div><h2 className="card-title">{title}</h2><div className="card-caption">{subtitle}</div></div>{compact ? <button className="btn secondary" onClick={onViewAll}>View all <ChevronRight size={14}/></button> : <button className="btn secondary" onClick={onViewAll}>Reset filters</button>}</div>
    {filters && <div className="controls"><label className="search-field" style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e1e7f0', borderRadius: 8, padding: '0 10px' }}><Search size={15} color="#8995a7"/><input aria-label="Search by description" className="field" style={{ border: 0, flex: 1, paddingLeft: 0, outline: 0 }} placeholder="Search description..." value={filters.query} onChange={e => filters.setQuery(e.target.value)}/></label><select className="select" aria-label="Filter by account" value={filters.selectedAccount} onChange={e => filters.setSelectedAccount(e.target.value)}><option value="all">All accounts</option>{filters.accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select><select className="select" aria-label="Filter by transaction type" value={filters.typeFilter} onChange={e => filters.setTypeFilter(e.target.value)}><option value="all">All types</option><option value="credit">Credit</option><option value="debit">Debit</option></select><select className="select" aria-label="Filter by status" value={filters.statusFilter} onChange={e => filters.setStatusFilter(e.target.value)}><option value="all">All statuses</option><option value="successful">Successful</option><option value="pending">Pending</option><option value="failed">Failed</option></select><select className="select" aria-label="Sort transactions" value={filters.sortBy} onChange={e => filters.setSortBy(e.target.value)}><option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option><option value="amount-desc">Amount: high to low</option><option value="amount-asc">Amount: low to high</option></select></div>}
  </div><div className="table-scroll"><table><thead><tr><th>Description</th><th>Date</th><th>Type</th><th>Status</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead><tbody>{rows.length ? rows.map(tx => <tr key={tx.id}><td><div className="tx-title">{tx.description}</div><div className="tx-ref">Ref: {tx.reference}</div></td><td>{dateLabel(tx.date)}</td><td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: tx.type === 'credit' ? '#16855f' : '#67748a' }}>{tx.type === 'credit' ? <ArrowDownLeft size={14}/> : <ArrowUpRight size={14}/>} {tx.type}</span></td><td><span className={`pill ${tx.status}`}>{tx.status}</span></td><td className={`amount ${tx.type === 'credit' ? 'green' : ''}`} style={{ textAlign: 'right' }}>{tx.type === 'credit' ? '+' : '−'}{money(tx.amount)}</td></tr>) : <tr><td colSpan={5}><div className="empty">No transactions found. Try changing your search or filters.</div></td></tr>}</tbody></table></div>
    {!compact && pagination && <div className="table-bottom"><span>Page {pagination.currentPage} of {pagination.pageCount}</span><div className="pagination"><button aria-label="Previous page" disabled={pagination.currentPage <= 1} onClick={() => pagination.setPage(pagination.currentPage - 1)}><ChevronLeft size={14}/></button><button aria-label="Next page" disabled={pagination.currentPage >= pagination.pageCount} onClick={() => pagination.setPage(pagination.currentPage + 1)}><ChevronRight size={14}/></button></div></div>}
  </section>;
}

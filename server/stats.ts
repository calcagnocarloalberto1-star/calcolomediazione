// In-memory statistics tracker
// Tracks: page views, API usage, feature usage over time

interface StatEntry {
  timestamp: Date;
  type: string; // 'page_view' | 'analisi_ai' | 'calcolo' | 'pdf_export' | 'procura_view' | 'chat_message' | 'upload_pdf'
  path?: string;
  userAgent?: string;
  ip?: string;
}

class StatsTracker {
  private entries: StatEntry[] = [];
  private counters = {
    totalPageViews: 0,
    analisiAiCreate: 0,
    analisiAiComplete: 0,
    analisiAiError: 0,
    calcoliEffettuati: 0,
    pdfExported: 0,
    chatMessages: 0,
    uploadPdf: 0,
    pageViews: {} as Record<string, number>,
  };
  private startTime = new Date();
  private hourlyViews: Record<string, number> = {}; // 'YYYY-MM-DD HH' -> count
  private dailyViews: Record<string, number> = {}; // 'YYYY-MM-DD' -> count

  track(type: string, path?: string, userAgent?: string, ip?: string) {
    const now = new Date();
    this.entries.push({ timestamp: now, type, path, userAgent, ip });

    // Keep only last 10000 entries to prevent memory issues
    if (this.entries.length > 10000) {
      this.entries = this.entries.slice(-5000);
    }

    // Update counters
    switch (type) {
      case 'page_view':
        this.counters.totalPageViews++;
        if (path) {
          this.counters.pageViews[path] = (this.counters.pageViews[path] || 0) + 1;
        }
        // Track hourly and daily
        const hourKey = now.toISOString().slice(0, 13).replace('T', ' ');
        const dayKey = now.toISOString().slice(0, 10);
        this.hourlyViews[hourKey] = (this.hourlyViews[hourKey] || 0) + 1;
        this.dailyViews[dayKey] = (this.dailyViews[dayKey] || 0) + 1;
        break;
      case 'analisi_ai':
        this.counters.analisiAiCreate++;
        break;
      case 'analisi_complete':
        this.counters.analisiAiComplete++;
        break;
      case 'analisi_error':
        this.counters.analisiAiError++;
        break;
      case 'calcolo':
        this.counters.calcoliEffettuati++;
        break;
      case 'pdf_export':
        this.counters.pdfExported++;
        break;
      case 'chat_message':
        this.counters.chatMessages++;
        break;
      case 'upload_pdf':
        this.counters.uploadPdf++;
        break;
    }
  }

  getStats() {
    const now = new Date();
    const uptimeMs = now.getTime() - this.startTime.getTime();
    const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));

    // Recent entries (last 24h)
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentEntries = this.entries.filter(e => e.timestamp > last24h);

    // Unique IPs in last 24h (approximate unique visitors)
    const uniqueIps = new Set(recentEntries.filter(e => e.ip).map(e => e.ip)).size;

    // Last 7 days daily views
    const last7Days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      last7Days[key] = this.dailyViews[key] || 0;
    }

    // Last 24h hourly views
    const last24hHourly: Record<string, number> = {};
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 13).replace('T', ' ');
      last24hHourly[key] = this.hourlyViews[key] || 0;
    }

    // Top pages
    const topPages = Object.entries(this.counters.pageViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Recent activity (last 20 events)
    const recentActivity = this.entries.slice(-20).reverse().map(e => ({
      timestamp: e.timestamp.toISOString(),
      type: e.type,
      path: e.path || '-',
    }));

    return {
      uptime: `${uptimeHours}h ${uptimeMinutes}m`,
      startTime: this.startTime.toISOString(),
      counters: this.counters,
      uniqueVisitors24h: uniqueIps,
      pageViews24h: recentEntries.filter(e => e.type === 'page_view').length,
      last7Days,
      last24hHourly,
      topPages,
      recentActivity,
      totalEntries: this.entries.length,
    };
  }
}

export const stats = new StatsTracker();

import { useState, useMemo, useCallback } from 'react';

/**
 * A reusable hook for filtering, searching, and sorting data.
 */
export function useDataFilter(data = [], {
  searchFields = [],
  initialFilters = {},
  initialSort = { field: null, direction: 'desc' },
} = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilters(initialFilters);
    setSort(initialSort);
  }, [initialFilters, initialSort]);

  const updateFilter = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const updateSort = useCallback((field, direction) => {
    setSort({ field, direction });
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    // 1. Search Logic
    if (searchQuery && searchFields.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });
    }

    // 2. Filter Logic
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === 'all' || value === 'All' || value === '') return;

      result = result.filter(item => {
        const itemValue = item[key];

        // Handle date range specifically
        if (key === 'dateRange' && value) {
          const itemDate = new Date(item.date);
          if (isNaN(itemDate.getTime())) return true; // Skip if invalid date

          const now = new Date();
          now.setHours(0, 0, 0, 0);

          if (value.type === 'today') {
            const today = new Date(now);
            return itemDate >= today;
          }
          if (value.type === '7days') {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 7);
            return itemDate >= sevenDaysAgo;
          }
          if (value.type === '30days') {
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setDate(now.getDate() - 30);
            return itemDate >= thirtyDaysAgo;
          }
          if (value.type === 'custom') {
            if (value.start) {
              const start = new Date(value.start);
              start.setHours(0, 0, 0, 0);
              if (itemDate < start) return false;
            }
            if (value.end) {
              const end = new Date(value.end);
              end.setHours(23, 59, 59, 999);
              if (itemDate > end) return false;
            }
            return true;
          }
          return true;
        }

        // Handle age range specifically
        if (key === 'ageRange') {
          const age = Number(item.age);
          if (value.min && age < Number(value.min)) return false;
          if (value.max && age > Number(value.max)) return false;
          return true;
        }

        // Handle earnings range specifically
        if (key === 'earningsRange') {
          const getEarningsValue = (u) => {
            if (u.earnings) {
              const total = u.earnings.find(e => e.label === 'Total');
              return total ? total.value : 0;
            }
            if (u.financialStats) {
              const spent = u.financialStats.find(s => s.label === 'Total Spent (INR)');
              return spent ? parseFloat(spent.value.replace(/[₹,]/g, '')) : 0;
            }
            return 0;
          };
          const earnings = getEarningsValue(item);
          if (value.min && earnings < Number(value.min)) return false;
          if (value.max && earnings > Number(value.max)) return false;
          return true;
        }

        // Handle status
        if (key === 'status') {
          return String(item.status || 'active').toLowerCase() === String(value).toLowerCase();
        }

        // Handle ID partial match
        if (key === 'id') {
          return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
        }

        // Handle online/offline
        if (key === 'onlineStatus') {
          return String(item.onlineStatus || 'offline').toLowerCase() === String(value).toLowerCase();
        }

        // Default equality check
        return String(itemValue).toLowerCase() === String(value).toLowerCase();
      });
    });

    // 3. Sort Logic
    if (sort.field) {
      result.sort((a, b) => {
        let valA, valB;

        // Special handling for different sort fields
        switch (sort.field) {
          case 'joinDate':
            valA = new Date(a.joinDate).getTime();
            valB = new Date(b.joinDate).getTime();
            break;
          case 'lastActive':
            // Simple heuristic: "Just now" < "2 mins ago" < "10 mins ago"
            const parseLastActive = (str) => {
              if (!str) return Infinity;
              if (str.includes('now')) return 0;
              const match = str.match(/(\d+)/);
              if (!match) return Infinity;
              let mins = parseInt(match[1]);
              if (str.includes('hour')) mins *= 60;
              if (str.includes('day')) mins *= 1440;
              return mins;
            };
            valA = parseLastActive(a.lastActive);
            valB = parseLastActive(b.lastActive);
            break;
          case 'earnings':
            const getEarnings = (u) => {
              if (u.earnings) {
                const total = u.earnings.find(e => e.label === 'Total');
                return total ? total.value : 0;
              }
              // For male users, check financialStats
              if (u.financialStats) {
                const spent = u.financialStats.find(s => s.label === 'Total Spent (INR)');
                return spent ? parseFloat(spent.value.replace(/[₹,]/g, '')) : 0;
              }
              return 0;
            };
            valA = getEarnings(a);
            valB = getEarnings(b);
            break;
          case 'totalChats':
            const getChats = (u) => {
              if (u.chatMetrics) {
                if (typeof u.chatMetrics.totalChats === 'string') {
                  return parseInt(u.chatMetrics.totalChats.replace(/,/g, ''));
                }
                if (Array.isArray(u.chatMetrics)) {
                  const total = u.chatMetrics.find(m => m.label === 'Total Chats');
                  return total ? parseInt(total.value) : 0;
                }
              }
              return 0;
            };
            valA = getChats(a);
            valB = getChats(b);
            break;
          default:
            valA = a[sort.field];
            valB = b[sort.field];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
        }

        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchFields, filters, sort]);

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    updateFilter,
    sort,
    setSort,
    updateSort,
    resetFilters,
  };
}

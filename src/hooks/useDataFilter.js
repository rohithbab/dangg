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
    if (!data || !Array.isArray(data)) return [];

    const result = data.filter(item => {
      // 1. Search Logic (Search across all searchFields)
      const query = searchQuery?.toLowerCase().trim();
      if (query && searchFields.length > 0) {
        const matchesSearch = searchFields.some(field => {
          const val = item[field];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(query);
        });
        if (!matchesSearch) return false;
      }

      // 2. Dropdown Filters Logic (INTERSECTION - ALL must be true)
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        // Skip empty or 'all' filters
        if (value === null || value === undefined || value === '' || value === 'all' || value === 'All') {
          return true;
        }

        switch (key) {
          case 'id': {
            const itemId = String(item.id || '').toLowerCase().replace('#', '');
            const filterId = String(value || '').toLowerCase().replace('#', '');
            return itemId.includes(filterId);
          }
          
          case 'hostName': {
            const host = String(item.host || item.participant1 || '').toLowerCase();
            const filterHost = String(value || '').toLowerCase();
            return host === filterHost || host.includes(filterHost);
          }

          case 'userName': {
            const user = String(item.guest || item.participant2 || '').toLowerCase();
            const filterUser = String(value || '').toLowerCase();
            return user === filterUser || user.includes(filterUser);
          }

          case 'userId': {
            const userId = String(item.guestId || item.participant2Id || '').toLowerCase();
            const filterUserId = String(value || '').toLowerCase();
            return userId === filterUserId;
          }

          case 'status': {
            const status = String(item.status || '').toLowerCase();
            const filterStatus = String(value || '').toLowerCase();
            return status === filterStatus;
          }

          case 'dateRange': {
            if (!value || value.type === 'all' || !value.type) return true;
            
            const itemDate = new Date(item.date);
            if (isNaN(itemDate.getTime())) return true;

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

          default: {
            const itemVal = String(item[key] || '').toLowerCase();
            const filterVal = String(value || '').toLowerCase();
            return itemVal === filterVal;
          }
        }
      });

      return matchesFilters;
    });

    // 3. Sort Logic
    if (sort.field) {
      result.sort((a, b) => {
        let valA, valB;
        switch (sort.field) {
          case 'date':
          case 'joinDate':
            valA = new Date(a[sort.field] || a.date).getTime();
            valB = new Date(b[sort.field] || b.date).getTime();
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

    // FINAL VERIFICATION LOGGING
    console.group('🔍 Filtering Pipeline Debug');
    console.log('Active Filters:', filters);
    console.log('Search Query:', searchQuery);
    console.log('Raw Data Count:', data.length);
    console.log('Filtered Results Count:', result.length);
    if (result.length > 0) {
      console.log('First Match ID:', result[0].id);
    }
    console.groupEnd();

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

import { useState, useMemo, useCallback } from 'react';

/**
 * A robust hook for filtering and searching data.
 * @param {Array} data - The raw dataset.
 * @param {Object} options - Configuration for search and initial filters.
 */
export function useFilteredData(data = [], {
  searchFields = [],
  initialFilters = {},
} = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  // Update a single filter value
  const updateFilter = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  // Reset all filters and search query
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilters(initialFilters);
  }, [initialFilters]);

  // The core filtering pipeline
  const filteredResults = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter(item => {
      // 1. Apply Smart Search (Case-insensitive match across specified fields)
      if (searchQuery && searchFields.length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = searchFields.some(field => {
          const val = item[field];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(query);
        });
        if (!matchesSearch) return false;
      }

      // 2. Apply Dropdown Filters (Strict intersection)
      const matchesDropdowns = Object.entries(filters).every(([key, value]) => {
        // Skip if filter is inactive
        if (value === null || value === undefined || value === '' || value === 'all' || value === 'All') {
          return true;
        }

        // Custom field logic
        switch (key) {
          case 'id':
          case 'chatId':
          case 'userId': {
            const itemVal = String(item[key] || item.id || item.guestId || '').toLowerCase().replace('#', '');
            const filterVal = String(value).toLowerCase().replace('#', '');
            return itemVal === filterVal || itemVal.includes(filterVal);
          }
          
          case 'hostName': {
            const host = String(item.host || item.participant1 || '').toLowerCase();
            const filterVal = String(value).toLowerCase();
            return host === filterVal;
          }

          case 'userName': {
            const user = String(item.guest || item.participant2 || item.name || '').toLowerCase();
            const filterVal = String(value).toLowerCase();
            return user === filterVal;
          }

          case 'status': {
            const status = String(item.status || '').toLowerCase();
            const filterVal = String(value).toLowerCase();
            return status === filterVal;
          }

          case 'gender': {
            const gender = String(item.gender || '').toLowerCase();
            const filterVal = String(value).toLowerCase();
            return gender === filterVal;
          }

          case 'accountStatus': {
            const status = String(item.accountStatus || item.status || '').toLowerCase();
            const filterVal = String(value).toLowerCase();
            return status === filterVal;
          }

          case 'ageRange': {
            const age = parseInt(item.age);
            if (isNaN(age)) return false;
            switch (value) {
              case '18-24': return age >= 18 && age <= 24;
              case '25-30': return age >= 25 && age <= 30;
              case '31-40': return age >= 31 && age <= 40;
              case '40+': return age > 40;
              default: return true;
            }
          }

          case 'dateRange': {
            const itemDate = new Date(item.date);
            if (isNaN(itemDate.getTime())) return true;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const itemTime = itemDate.getTime();
            const todayTime = today.getTime();
            const oneDay = 24 * 60 * 60 * 1000;

            if (value === 'Custom Date') {
              const start = filters.startDate ? new Date(filters.startDate).getTime() : 0;
              const end = filters.endDate ? new Date(filters.endDate).getTime() : Infinity;
              // Set end to end of day
              const adjustedEnd = filters.endDate ? end + oneDay - 1 : Infinity;
              return itemTime >= start && itemTime <= adjustedEnd;
            }

            switch (value) {
              case 'Today': {
                return itemTime >= todayTime;
              }
              case 'Last 7 Days': {
                return itemTime >= (todayTime - 7 * oneDay);
              }
              case 'Last 30 Days': {
                return itemTime >= (todayTime - 30 * oneDay);
              }
              default: return true;
            }
          }

          default: {
            const itemVal = String(item[key] || '').toLowerCase();
            const filterVal = String(value).toLowerCase();
            return itemVal === filterVal;
          }
        }
      });

      return matchesDropdowns;
    });
  }, [data, searchQuery, searchFields, filters]);

  // Debug logging
  console.group('🛠️ useFilteredData Debug');
  console.log('Filters:', filters);
  console.log('Search:', searchQuery);
  console.log('Results:', filteredResults.length);
  console.groupEnd();

  return {
    filteredResults,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
  };
}

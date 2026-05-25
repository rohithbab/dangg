import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer, PageHeader } from '../components/layout';
import { VerificationRequestCard } from '../components/ui/VerificationRequestCard';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { useFilteredData } from '../hooks/useFilteredData';

const VERIFICATION_REQUESTS = [
  {
    id: '8821',
    name: 'Ananya Sharma',
    phone: '+91 98765 43210',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCTR3TPyTm6JN4jrdK8b1qy6gZvvRasg6bdC4YItSFCO91exl2x_hPnsx2UfvzjXKR53avei1K-kqvwrv-hPqPE8zQIfjmw2eR3C9JDNQZYaTv-BPhlBZIvCG_SBzKsp9FOF997v_jYuZBVU1QGcTym64C6uKR_okBmHYIScKte43hNyGQT0kg4E0tlqncoWOPyFnz0ghreuEk1vicFKx5NzX_VrfFHRn8hfAqF2ogzk1LUZnYlQBVH3a42GMFRw6d9GgRuJxECE3M',
    imageAlt: 'Ananya Sharma profile',
  },
  {
    id: '8822',
    name: 'Priya Verma',
    phone: '+91 91234 56789',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqi1nNuXAsOsAiResvU0qROF4IOgHHAcxQvea3A-e6YyPbuXrnuYeSJG_-kinEQq65aYv3FBJN0x7hHF1yeyBGaokbkJeOoDfl0MOwKbPwq2osym3zo_MpL0deGldttJwenO1-IJ1XlzuwShlKjvZs117kwntlAVdsdL8s0WQ02GABcEjQCFndzZDPlxz1gatt2x81C7Hk7ffSaFdxfRqoURGVRaIcAantE3Q3LB8Astlccm02MMgReTs5U_EMyl6ljxLMRt_l7cY',
    imageAlt: 'Priya Verma profile',
  },
  {
    id: '8823',
    name: 'Sneha Kapoor',
    phone: '+91 99887 76655',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCuGLcL-eTvHzz46renuBcZYKzb3QXjSDMC3Ga3Wqx7Y9izAv-0W4gAI3VPITGVEJwA4imRbPjfShGIBQoO3HvsNwBR7IFYl6_tJjmQLK5qjRnzSuuPozx5nCFbUezL-bZvttJDYYZ9PH-Snbrl0hDn13p7tNm8z6oYz0GUqruioJzR0tGEjVIqCGyarzP_zFN-kxnKUMkUdmvw6XqB2SbVi4Azr8KMFuXLkVzpJqKpxfBJCvafxljnd7ffFTKpEbCTsb8G_Ltdbm0',
    imageAlt: 'Sneha Kapoor profile',
  },
  {
    id: '8824',
    name: 'Isha Singh',
    phone: '+91 97766 55443',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQskZKw-TxmIlNZ5M6CtiOBoCRxn7lD8RKQdvuQnCuYDcHq7LBuw-MDVIA6XyTe7bogiOQRaPXiFPQkdE53203n8vi7pWip0u8P4Fk6HJqb-kFAiSuPds6_WtSDkEKFT2RJSlF5yXoXN1pLhXBdr141oheFvmE6nAceu24Xwy-xx15DgGXeYIa4R-w33iryk3RssmRI9Dhk59YInU5vyauq7EUqwTjGWtbe-Tm3bcntZ5XhkjQ6K9NpCfyNsfasuIssJrst5tHr6Y',
    imageAlt: 'Isha Singh profile',
  },
  {
    id: '8825',
    name: 'Kavita Gupta',
    phone: '+91 96655 44332',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCoj9Bo3AjY1EkfsSHv9sVgwYdjSFJBxlQKkqWvasN2pOyHd5O8lTL6QzIJplC5LG3mABRWykTjIwdCb1nFkXy4Gop9rYkVhtBrT0QLfdqT1HCmJfYihSaMHAv6X8jLDWdf07GgyYAy0AfhuvZf3tvmrA3MA1_Ia2WGfdDqWCBmDuDUVLYg1ssrgsOSSX18k5xtwUJbwOlCtWyo4Whd98bkNvuImSJuV7QSkL8-ezQW8yPraEvMzhV5Hvq9Xt9-3cZsnevVZzvWhtI',
    imageAlt: 'Kavita Gupta profile',
  },
  {
    id: '8826',
    name: 'Aditi Reddy',
    phone: '+91 95544 33221',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCCOy7Il8d0C6TRLa90f8d0Mb-OorPcgI7__2ZHk3DyZscywpcBOl5Sm89u9Nj8x-cjEAF_szgptC5RoiWm4lyUNClA7UuZIGpIS9JFLAQVSQwUTgU0N_mF6Jj6s8j2DFoCnQgZLO8Ed7IiJrZgjx2J33_X_HIJkS7CFqcVXwrVCN4WXcxSmUCXpnr7syeQM1mvbQy9YZblLUUI_U_MSx1Ny16TAS8p9p1QzES31l42zZzp3S0AgPgNWwdiiI3cBJ4Zt6dRIEZLF8',
    imageAlt: 'Aditi Reddy profile',
  },
];

export function PendingVerificationPage() {
  const {
    filteredResults,
    searchQuery,
    setSearchQuery,
    resetFilters,
  } = useFilteredData(VERIFICATION_REQUESTS, {
    searchFields: ['name', 'id', 'phone'],
  });

  return (
    <PageContainer>
      <PageHeader description="Female accounts awaiting manual review">
        <div className="relative w-full max-w-sm">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
            placeholder="Search by name, ID or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeader>

      <section className="min-h-[400px]">
        <AnimatePresence>
          {filteredResults.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredResults.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <VerificationRequestCard {...request} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant"
            >
              <MaterialIcon name="person_search" className="!text-6xl text-outline-variant mb-4" />
              <h3 className="type-title-lg text-on-surface">No verification requests found</h3>
              <p className="type-body-md text-on-surface-variant mt-1">
                Try a different search term or clear filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 btn-secondary"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageContainer>
  );
}

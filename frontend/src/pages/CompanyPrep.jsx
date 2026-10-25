import React from 'react';
import { useToast } from '../context/ToastContext';
import { CompanyExplorerWidget } from '../components/CompanyExplorerWidget';
import { CompanyTestsSection } from '../components/CompanyTestsSection';
import { PlacementStepper } from '../components/PlacementStepper';

export const CompanyPrep = () => {
  const { addToast } = useToast();

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-16 w-full max-w-full min-w-0">
      {/* Step-by-Step Placement Stepper */}
      <PlacementStepper currentStep={4} />

      {/* AI-Powered Company Explorer & Career Intelligence Dashboard */}
      <CompanyExplorerWidget />

      {/* Interactive Company Placement Tests & Details Section */}
      <CompanyTestsSection
        onDownloadPDF={() => {
          addToast('Generating Company Preparation Master Performance PDF...', 'info');
          window.print();
        }}
      />
    </div>
  );
};

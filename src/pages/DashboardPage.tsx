import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import BrandManager from '../components/dashboard/BrandManager';
import ChatAgent from '../components/dashboard/ChatAgent';
import Downloads from '../components/dashboard/Downloads';
import UserProfile from '../components/dashboard/UserProfile';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('brands');

  const renderContent = () => {
    switch (activeTab) {
      case 'brands':
        return <BrandManager />;
      case 'chat':
        return <ChatAgent />;
      case 'downloads':
        return <Downloads />;
      case 'profile':
        return <UserProfile />;
      default:
        return <BrandManager />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default DashboardPage;
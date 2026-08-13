import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { DemoProvider, useDemo } from './src/store/DemoStore';
import { PageKey } from './src/types';
import { Shell } from './src/components/Shell';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { OrganizationScreen, PeopleScreen } from './src/screens/OrganizationPeopleScreens';
import { ApprovalsScreen, AttendanceScreen, RecruitmentScreen, RequestsScreen } from './src/screens/TalentTimeScreens';
import { BenefitsScreen, PerformanceScreen } from './src/screens/BenefitsPerformanceScreens';
import { PayrollScreen, ReportsScreen } from './src/screens/PayrollReportsScreens';
import { AdministrationScreen, IntegrationsScreen } from './src/screens/IntegrationsAdminScreens';
import { DocumentsScreen, ImportsScreen, OperationsScreen } from './src/screens/DemoPlusScreens';

function DemoApp() {
  const { persona, canAccess } = useDemo();
  const [page, setPage] = useState<PageKey>('dashboard');

  useEffect(() => {
    if (persona && !canAccess(page)) setPage('dashboard');
  }, [persona, page, canAccess]);

  if (!persona) return <LoginScreen />;

  const screens: Record<PageKey, React.ReactNode> = {
    dashboard: <DashboardScreen onNavigate={setPage} />,
    operations: <OperationsScreen onNavigate={setPage} />,
    organization: <OrganizationScreen />,
    recruitment: <RecruitmentScreen />,
    people: <PeopleScreen />,
    imports: <ImportsScreen />,
    documents: <DocumentsScreen />,
    attendance: <AttendanceScreen />,
    requests: <RequestsScreen />,
    benefits: <BenefitsScreen />,
    performance: <PerformanceScreen />,
    approvals: <ApprovalsScreen />,
    payroll: <PayrollScreen />,
    reports: <ReportsScreen />,
    integrations: <IntegrationsScreen />,
    administration: <AdministrationScreen />,
  };

  return <Shell page={page} onNavigate={setPage}>{screens[page]}</Shell>;
}

export default function App() {
  return <View style={styles.root}><StatusBar style="dark" /><DemoProvider><DemoApp /></DemoProvider></View>;
}

const styles = StyleSheet.create({ root: { flex: 1 } });

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Button, Card, Badge } from '@hms/ui-mobile';
import { theme, commonStyles } from '@hms/design-tokens/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[commonStyles.h1, styles.headerTitle]}>Dashboard</Text>
          <Button 
            title="+ New Patient"
            size="sm"
            onPress={() => {
              // TODO: Navigate to new patient screen
              console.log('New patient pressed');
            }}
          />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Text style={[commonStyles.h3, styles.sectionTitle]}>Today's Overview</Text>
          
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>1,234</Text>
              <Text style={styles.statLabel}>Total Patients</Text>
              <Text style={styles.statChange}>+12% from last month</Text>
            </Card>

            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Today's Appointments</Text>
              <Text style={styles.statChange}>8 completed, 34 remaining</Text>
            </Card>

            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>28</Text>
              <Text style={styles.statLabel}>Active Staff</Text>
              <Text style={styles.statChange}>24 doctors, 4 nurses</Text>
            </Card>

            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Queue Status</Text>
              <Text style={styles.statChange}>Avg wait: 12 min</Text>
            </Card>
          </View>
        </View>

        {/* Recent Patients */}
        <View style={styles.patientsSection}>
          <Text style={[commonStyles.h3, styles.sectionTitle]}>Recent Patients</Text>
          
          <Card style={styles.patientsCard}>
            {[
              { name: 'John Doe', time: '2 min ago', status: 'checked-in', id: 'P001' },
              { name: 'Jane Smith', time: '5 min ago', status: 'waiting', id: 'P002' },
              { name: 'Robert Johnson', time: '8 min ago', status: 'in-consultation', id: 'P003' },
              { name: 'Emily Davis', time: '12 min ago', status: 'completed', id: 'P004' },
            ].map((patient, index) => (
              <View 
                key={patient.id} 
                style={[
                  styles.patientItem,
                  index < 3 && styles.patientItemBorder
                ]}
              >
                <View style={styles.patientInfo}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.patientInitials}>
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientId}>ID: {patient.id}</Text>
                  </View>
                </View>
                
                <View style={styles.patientMeta}>
                  <Badge 
                    variant={
                      patient.status === 'completed' ? 'success' : 
                      patient.status === 'in-consultation' ? 'warning' : 'default'
                    }
                  >
                    {patient.status.replace('-', ' ')}
                  </Badge>
                  <Text style={styles.patientTime}>{patient.time}</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={[commonStyles.h3, styles.sectionTitle]}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            <Button
              title="📝 Register Patient"
              variant="outline"
              style={styles.actionButton}
              onPress={() => console.log('Register patient')}
            />
            
            <Button
              title="⏰ Manage Queue"
              variant="outline"
              style={styles.actionButton}
              onPress={() => console.log('Manage queue')}
            />
            
            <Button
              title="📅 Appointments"
              variant="outline"
              style={styles.actionButton}
              onPress={() => console.log('View appointments')}
            />
            
            <Button
              title="👥 Staff Management"
              variant="outline"
              style={styles.actionButton}
              onPress={() => console.log('Staff management')}
            />
          </View>
        </View>

        {/* Alerts */}
        <View style={styles.alertsSection}>
          <Text style={[commonStyles.h3, styles.sectionTitle]}>Recent Alerts</Text>
          
          <View style={styles.alertsContainer}>
            <View style={[styles.alert, styles.alertWarning]}>
              <Text style={styles.alertTitle}>⚠️ Lab results pending</Text>
              <Text style={styles.alertText}>3 lab reports are awaiting doctor review</Text>
            </View>
            
            <View style={[styles.alert, styles.alertCritical]}>
              <Text style={styles.alertTitle}>🚨 Emergency patient</Text>
              <Text style={styles.alertText}>Critical patient admitted to ER - requires immediate attention</Text>
            </View>
            
            <View style={[styles.alert, styles.alertInfo]}>
              <Text style={styles.alertTitle}>ℹ️ System update</Text>
              <Text style={styles.alertText}>Scheduled maintenance tonight at 2:00 AM</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.semantic.componentPadding.md,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  
  headerTitle: {
    color: theme.colors.semantic.text,
  },
  
  sectionTitle: {
    marginBottom: theme.spacing[4],
    color: theme.colors.semantic.text,
  },
  
  statsSection: {
    marginBottom: theme.spacing[8],
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    justifyContent: 'space-between',
  },
  
  statCard: {
    width: '47%',
    padding: theme.spacing[4],
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.semantic.text,
    marginBottom: theme.spacing[1],
  },
  
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.semantic.text,
    marginBottom: theme.spacing[1],
  },
  
  statChange: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.textMuted,
    textAlign: 'center',
  },
  
  patientsSection: {
    marginBottom: theme.spacing[8],
  },
  
  patientsCard: {
    padding: theme.spacing[4],
  },
  
  patientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
  },
  
  patientItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.border,
  },
  
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  patientAvatar: {
    width: theme.spacing[10],
    height: theme.spacing[10],
    borderRadius: theme.spacing[5],
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[3],
  },
  
  patientInitials: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary[700],
  },
  
  patientDetails: {
    flex: 1,
  },
  
  patientName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.semantic.text,
  },
  
  patientId: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.textMuted,
  },
  
  patientMeta: {
    alignItems: 'flex-end',
  },
  
  patientTime: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.textMuted,
    marginTop: theme.spacing[1],
  },
  
  actionsSection: {
    marginBottom: theme.spacing[8],
  },
  
  actionsGrid: {
    gap: theme.spacing[3],
  },
  
  actionButton: {
    marginBottom: theme.spacing[2],
  },
  
  alertsSection: {
    marginBottom: theme.spacing[8],
  },
  
  alertsContainer: {
    gap: theme.spacing[3],
  },
  
  alert: {
    padding: theme.spacing[4],
    borderRadius: theme.borders.radius.md,
    borderLeftWidth: theme.borders.width.thick,
  },
  
  alertWarning: {
    backgroundColor: theme.colors.warning[50],
    borderLeftColor: theme.colors.warning[500],
  },
  
  alertCritical: {
    backgroundColor: theme.colors.error[50],
    borderLeftColor: theme.colors.error[500],
  },
  
  alertInfo: {
    backgroundColor: theme.colors.primary[50],
    borderLeftColor: theme.colors.primary[500],
  },
  
  alertTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing[1],
  },
  
  alertText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.textMuted,
  },
});
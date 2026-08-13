import React, { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ArrowRight, CheckCircle2, DatabaseZap, ShieldCheck, Sparkles } from 'lucide-react-native';
import { DEMO_PASSWORD, personas } from '../data/seed';
import { colors, radii, shadow } from '../theme';
import { Role } from '../types';
import { useDemo } from '../store/DemoStore';
import { Button, Field } from '../components/ui';

export function LoginScreen() {
  const { width } = useWindowDimensions();
  const narrow = width < 850;
  const { login, message } = useDemo();
  const [selected, setSelected] = useState<Role>('hr');
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const account = personas.find((item) => item.role === selected)!;

  return <KeyboardAvoidingView style={styles.root}><ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled"><View style={[styles.frame, narrow && styles.frameNarrow]}>
    <View style={[styles.story, narrow && styles.storyNarrow]}>
      <View style={styles.brand}><View style={styles.logo}><Text style={styles.logoText}>Z</Text></View><View><Text style={styles.brandName}>ZylHR</Text><Text style={styles.brandSub}>Enterprise HRIS · Client Demo</Text></View></View>
      <View style={styles.hero}><View style={styles.eyebrow}><Sparkles size={14} color="#B4C5FF" /><Text style={styles.eyebrowText}>One connected people journey</Text></View><Text style={styles.heroTitle}>From hiring to payday, in one traceable flow.</Text><Text style={styles.heroBody}>Explore a fictional Philippine enterprise with 250 employees, connected approvals, attendance, benefits, performance, payroll, and safe demo outputs.</Text></View>
      <View style={styles.proofList}>{['Functional workflows, not static screens', 'Role-specific access and approvals', 'Runtime-only fictional data'].map((item) => <View key={item} style={styles.proof}><CheckCircle2 size={16} color="#86EFAC" /><Text style={styles.proofText}>{item}</Text></View>)}</View>
      <View style={styles.resetCard}><DatabaseZap size={18} color="#B4C5FF" /><View style={{ flex: 1 }}><Text style={styles.resetTitle}>Fresh session by design</Text><Text style={styles.resetBody}>Changes stay while you sign out and change personas. Reloading this page restores the deterministic seed.</Text></View></View>
    </View>
    <View style={styles.loginPane}><View style={styles.loginInner}>
      <View><Text style={styles.loginTitle}>Choose a demo account</Text><Text style={styles.loginSub}>Separate accounts demonstrate permissions. There is no in-session role switch.</Text></View>
      <View style={styles.accounts}>{personas.map((persona) => <Pressable key={persona.role} onPress={() => setSelected(persona.role)} style={[styles.account, selected === persona.role && styles.accountActive]}><View style={[styles.accountAvatar, selected === persona.role && styles.accountAvatarActive]}><Text style={[styles.accountInitials, selected === persona.role && { color: '#fff' }]}>{persona.initials}</Text></View><View style={{ flex: 1 }}><Text style={styles.accountTitle}>{persona.title}</Text><Text style={styles.accountEmail}>{persona.email}</Text></View>{selected === persona.role ? <CheckCircle2 size={18} color={colors.blue} /> : null}</Pressable>)}</View>
      <View style={styles.selectedCard}><Text style={styles.selectedLabel}>What you can demonstrate</Text><Text style={styles.selectedTitle}>{account.title}</Text><Text style={styles.selectedBody}>{account.description}</Text></View>
      <Field label="Shared demo password" value={password} onChangeText={setPassword} secureTextEntry accessibilityLabel="Shared demo password" />
      {message ? <Text style={styles.error}>{message}</Text> : null}
      <Button label={`Continue as ${account.title}`} icon={ArrowRight} onPress={() => login(account.email, password)} />
      <View style={styles.disclaimer}><ShieldCheck size={15} color={colors.muted} /><Text style={styles.disclaimerText}>Demo authentication is a workflow illustration, not a production security boundary. All people and identifiers are fictional.</Text></View>
    </View></View>
  </View></ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EEF2F8' }, scroll: { flexGrow: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }, frame: { width: '100%', maxWidth: 1180, minHeight: 700, flexDirection: 'row', borderRadius: 18, overflow: 'hidden', backgroundColor: colors.surface, ...shadow }, frameNarrow: { flexDirection: 'column' },
  story: { width: '43%', padding: 42, backgroundColor: colors.ink, justifyContent: 'space-between' }, storyNarrow: { width: '100%', gap: 28, padding: 28 }, brand: { flexDirection: 'row', alignItems: 'center', gap: 11 }, logo: { width: 38, height: 38, borderRadius: 9, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }, logoText: { color: '#fff', fontWeight: '900', fontSize: 20 }, brandName: { color: '#fff', fontSize: 18, fontWeight: '900' }, brandSub: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  hero: { gap: 16 }, eyebrow: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.full, backgroundColor: 'rgba(37,99,235,0.18)' }, eyebrowText: { color: '#DCE6FF', fontSize: 11, fontWeight: '700' }, heroTitle: { color: '#fff', fontSize: 38, lineHeight: 46, fontWeight: '900', letterSpacing: -1 }, heroBody: { color: '#CBD5E1', fontSize: 14, lineHeight: 23 },
  proofList: { gap: 12 }, proof: { flexDirection: 'row', alignItems: 'center', gap: 9 }, proofText: { color: '#E2E8F0', fontSize: 12, fontWeight: '600' }, resetCard: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: radii.lg, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }, resetTitle: { color: '#fff', fontWeight: '800', fontSize: 12 }, resetBody: { color: '#AEBBCB', fontSize: 10, lineHeight: 16, marginTop: 4 },
  loginPane: { flex: 1, padding: 38 }, loginInner: { width: '100%', maxWidth: 570, alignSelf: 'center', gap: 17 }, loginTitle: { color: colors.ink, fontSize: 24, fontWeight: '900' }, loginSub: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5 }, accounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, account: { width: '48.5%', minWidth: 210, minHeight: 58, flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 9, padding: 10, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.surface }, accountActive: { borderColor: colors.blue, backgroundColor: colors.blueSoft }, accountAvatar: { width: 32, height: 32, borderRadius: radii.full, backgroundColor: '#E9EEF5', alignItems: 'center', justifyContent: 'center' }, accountAvatarActive: { backgroundColor: colors.blue }, accountInitials: { color: colors.muted, fontSize: 10, fontWeight: '900' }, accountTitle: { color: colors.text, fontSize: 11, fontWeight: '800' }, accountEmail: { color: colors.muted, fontSize: 9, marginTop: 2 }, selectedCard: { padding: 14, borderLeftWidth: 3, borderColor: colors.blue, backgroundColor: colors.surfaceAlt, borderRadius: radii.md }, selectedLabel: { color: colors.blueDark, fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.7 }, selectedTitle: { color: colors.ink, fontSize: 13, fontWeight: '800', marginTop: 5 }, selectedBody: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 3 }, error: { color: colors.red, fontSize: 11 }, disclaimer: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 }, disclaimerText: { color: colors.muted, fontSize: 9, lineHeight: 14, flex: 1 },
});

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { useAuth } from "../contexts/AuthContext";
import { DemoLoginButton } from "../components/DemoLoginButton";

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Falha ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>SERVIXA</Text>
          <Text style={styles.subtitle}>Encontre os melhores serviços</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.text.secondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.text.secondary}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.linkText}>
              Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoDivider}>
          <View style={styles.demoLine} />
          <Text style={styles.demoOr}>ou</Text>
          <View style={styles.demoLine} />
        </View>

        <DemoLoginButton onSuccess={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: spacing.lg },
  logoContainer: { alignItems: "center", marginBottom: spacing.xxl * 2 },
  logoText: { fontSize: 32, fontWeight: "bold", color: colors.primary },
  subtitle: { fontSize: 14, color: colors.text.secondary, marginTop: spacing.sm },
  form: { gap: spacing.lg },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.surface, fontSize: 16, fontWeight: "600" },
  linkButton: { alignItems: "center", paddingVertical: spacing.md },
  linkText: { fontSize: 14, color: colors.text.secondary },
  linkBold: { color: colors.primary, fontWeight: "600" },
  demoDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  demoLine: { flex: 1, height: 1, backgroundColor: colors.border },
  demoOr: { fontSize: 12, color: colors.text.secondary },
});

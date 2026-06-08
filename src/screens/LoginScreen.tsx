import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { useAuth } from "../contexts/AuthContext";
import { DemoLoginButton } from "../components/DemoLoginButton";
import {
  FADE_IN_DOWN,
  FADE_IN_UP,
  ZOOM_IN,
  staggeredEntrance,
} from "../utils/animations";

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
        <Animated.View entering={FADE_IN_DOWN} style={styles.logoContainer}>
          <Text style={styles.logoText}>SERVIXA</Text>
          <Text style={styles.subtitle}>Encontre os melhores serviços</Text>
        </Animated.View>

        <View style={styles.form}>
          <Animated.View entering={staggeredEntrance(100)}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.text.secondary}
            />
          </Animated.View>

          <Animated.View entering={staggeredEntrance(200)}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.text.secondary}
            />
          </Animated.View>

          <Animated.View entering={staggeredEntrance(300)}>
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </Pressable>
          </Animated.View>

          <Animated.View entering={staggeredEntrance(400)}>
            <Pressable
              style={styles.linkButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.linkText}>
                Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        <Animated.View entering={staggeredEntrance(500)} style={styles.demoDivider}>
          <View style={styles.demoLine} />
          <Text style={styles.demoOr}>ou</Text>
          <View style={styles.demoLine} />
        </Animated.View>

        <Animated.View entering={ZOOM_IN}>
          <DemoLoginButton onSuccess={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })} />
        </Animated.View>
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

import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { useAuth } from "../contexts/AuthContext";

const DEMO_EMAIL = "demo@servixa.com";
const DEMO_PASSWORD = "123456";

interface Props {
  onSuccess: () => void;
}

export const DemoLoginButton: React.FC<Props> = ({ onSuccess }) => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await signIn(DEMO_EMAIL, DEMO_PASSWORD);
      onSuccess();
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Falha ao entrar como demo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={handleDemoLogin}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={colors.surface} size="small" />
      ) : (
        <>
          <Text style={styles.icon}>🚀</Text>
          <Text style={styles.text}>Login como Demonstração</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    height: 48,
  },
  buttonDisabled: { opacity: 0.6 },
  icon: { fontSize: 18 },
  text: { color: colors.surface, fontSize: 16, fontWeight: "600" },
});

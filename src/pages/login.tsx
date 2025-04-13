"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { sendPasswordResetEmail } from "firebase/auth"
import {
  alpha,
  Box,
  Container,
  Typography,
  TextField,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material"
import { styled } from "@mui/material/styles"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
}

// Styled components
const GlassCard = styled(motion.div)(({ theme }) => ({
  position: "relative",
  background: "rgba(12, 10, 29, 0.65)",
  backdropFilter: "blur(12px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  overflow: "hidden",
  padding: theme.spacing(5),
}))

const NeonBorder = styled(motion.div)({
  position: "absolute",
  inset: 0,
  padding: "2px",
  borderRadius: "24px",
  background: "linear-gradient(45deg, #FF2FED, #844FFF, #4a9fff)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
  pointerEvents: "none",
})

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiFilledInput-root": {
    borderRadius: "12px",
    backgroundColor: alpha(theme.palette.background.paper, 0.4),
    backdropFilter: "blur(5px)",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.6),
    },
    "&.Mui-focused": {
      backgroundColor: alpha(theme.palette.background.paper, 0.6),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
    }
  },
  "& .MuiFilledInput-input": {
    padding: "20px 16px 12px",
  }
}))

// Option 1: Modify your GradientButton definition to use motion
const GradientButton = styled(motion(Button))(() => ({
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 24px",
  fontSize: "1rem",
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(to right, #844FFF, #FF2FED)",
  boxShadow: "0 10px 15px -3px rgba(130, 74, 254, 0.3)",
  "&:hover": {
    boxShadow: "0 12px 20px -5px rgba(130, 74, 254, 0.4)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "200%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "0.5s",
  },
  "&:hover::before": {
    left: "100%",
  }
}))

const ErrorMessage = styled(motion.div)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 2),
  borderRadius: "12px",
  backgroundColor: "rgba(220, 38, 38, 0.1)",
  border: "1px solid rgba(220, 38, 38, 0.2)",
  color: "#f87171",
  fontSize: "0.875rem",
  marginBottom: theme.spacing(2),
}))

const BrandLogo = styled(motion.div)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  marginBottom: "24px",
})

const LogoGlow = styled(motion.div)({
  position: "absolute",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #844FFF, #FF2FED)",
  filter: "blur(15px)",
  opacity: 0.6,
})

// Modern Gen Z theme
const genZTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#844FFF", light: "#9F7AEA" },
    secondary: { main: "#FF2FED" },
    background: { default: "#0A0118", paper: "#12101F" },
    text: { primary: "#FFFFFF", secondary: "rgba(255,255,255,0.7)" },
  },
  typography: {
    fontFamily: '"Inter", "Montserrat", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
      fontSize: "2rem",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
      fontSize: "1.5rem",
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
  },
  shape: { borderRadius: 16 },
})

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [resetMessage, setResetMessage] = useState("")


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/admin")
    } catch {
      setError("Invalid credentials or error during login.")
    } finally {
      setLoading(false)
    }
  }

  // Animated background mesh gradients
  const bgMeshes = [
    {
      position: { top: "-15%", left: "-10%" },
      size: { width: "40%", height: "50%" },
      color: "radial-gradient(circle, rgba(132, 79, 255, 0.2) 0%, rgba(132, 79, 255, 0) 70%)",
      animationDuration: "25s",
    },
    {
      position: { bottom: "-20%", right: "-5%" },
      size: { width: "50%", height: "60%" },
      color: "radial-gradient(circle, rgba(255, 47, 237, 0.15) 0%, rgba(255, 47, 237, 0) 70%)",
      animationDuration: "20s",
    },
    {
      position: { top: "30%", right: "-20%" },
      size: { width: "40%", height: "40%" },
      color: "radial-gradient(circle, rgba(74, 159, 255, 0.15) 0%, rgba(74, 159, 255, 0) 70%)",
      animationDuration: "28s",
    },
  ]

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.")
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setResetMessage("Password reset email sent. Check your inbox.")
      setError("")
    } catch {
      setError("Failed to send password reset email.")
    }
  }


  return (
    <ThemeProvider theme={genZTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0118 0%, #1A142F 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background meshes */}
        {bgMeshes.map((mesh, index) => (
          <Box
            key={index}
            component={motion.div}
            animate={{
              x: [0, 30, -20, 10, 0],
              y: [0, -20, 30, -10, 0],
            }}
            transition={{
              duration: mesh.animationDuration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            sx={{
              position: "absolute",
              ...mesh.position,
              width: mesh.size.width,
              height: mesh.size.height,
              background: mesh.color,
              borderRadius: "50%",
              filter: "blur(80px)",
              zIndex: 0,
            }}
          />
        ))}

        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <GlassCard
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.6)" }}
              as="form"
              onSubmit={handleLogin}
            >
              <NeonBorder
                animate={{
                  background: [
                    "linear-gradient(45deg, #FF2FED, #844FFF, #4a9fff)",
                    "linear-gradient(190deg, #4a9fff, #844FFF, #FF2FED)",
                    "linear-gradient(320deg, #844FFF, #4a9fff, #FF2FED)",
                    "linear-gradient(45deg, #FF2FED, #844FFF, #4a9fff)",
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div variants={itemVariants}>
                <BrandLogo>
                  <LogoGlow
                    animate={{
                      opacity: [0.6, 0.8, 0.6],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      fontSize: "1.75rem",
                    }}
                  >
                    Status
                    <Box component="span" sx={{
                      background: "linear-gradient(to right, #844FFF, #FF2FED)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      ml: 0.5,
                    }}>
                      Monitor
                    </Box>
                  </Typography>
                </BrandLogo>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{
                    mb: 4,
                    color: "#FFFFFF",
                  }}
                >
                  Sign in to your account
                </Typography>
              </motion.div>

              {error && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ErrorMessage>
                    <AlertCircle size={16} style={{ marginRight: 8, flexShrink: 0 }} />
                    {error}
                  </ErrorMessage>
                </motion.div>
              )}

              {resetMessage && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: 2,
                      borderRadius: "12px",
                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                      color: "#4ade80",
                      fontSize: "0.875rem",
                      mb: 2,
                    }}
                  >
                    ✅ {resetMessage}
                  </Box>
                </motion.div>
              )}


              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: alpha("#fff", 0.7),
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    Email
                  </Typography>
                  <StyledTextField
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    fullWidth
                    variant="filled"
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </Box>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha("#fff", 0.7),
                        fontWeight: 500,
                      }}
                    >
                      Password
                    </Typography>
                    <Box
                      onClick={handleForgotPassword}
                      sx={{
                        cursor: "pointer",
                        color: genZTheme.palette.primary.main,
                        fontSize: "0.75rem",
                        textDecoration: "none",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          width: "100%",
                          transform: "scaleX(0)",
                          height: "1px",
                          bottom: "-1px",
                          left: 0,
                          background: "linear-gradient(to right, #844FFF, #FF2FED)",
                          transformOrigin: "bottom right",
                          transition: "transform 0.3s ease-out"
                        },
                        "&:hover::after": {
                          transform: "scaleX(1)",
                          transformOrigin: "bottom left"
                        }
                      }}
                    >
                      Forgot password?
                    </Box>

                  </Box>
                  <StyledTextField
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    fullWidth
                    variant="filled"
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </Box>
              </motion.div>

              {/* Submit Button with Animation */}
              <motion.div variants={itemVariants}>
                <GradientButton
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "100%" }}
                      style={{ position: "relative", height: "24px" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                          height: "4px",
                          background: "rgba(255,255,255,0.5)",
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          borderRadius: "2px",
                        }}
                      />
                      <Typography>Signing In...</Typography>
                    </motion.div>
                  ) : (
                    "Sign In"
                  )}
                </GradientButton>
              </motion.div>

              {/* Sign up link */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    mt: 3,
                    color: alpha("#fff", 0.7),
                    fontSize: "0.95rem"
                  }}
                >
                  Don&apos;t have an account?{" "}
                  <Box
                    component={Link}
                    href="/signup"
                    sx={{
                      color: "#844FFF",
                      fontWeight: 600,
                      textDecoration: "none",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: "100%",
                        transform: "scaleX(0)",
                        height: "2px",
                        bottom: "-2px",
                        left: 0,
                        background: "linear-gradient(to right, #844FFF, #FF2FED)",
                        transformOrigin: "bottom right",
                        transition: "transform 0.3s ease-out"
                      },
                      "&:hover::after": {
                        transform: "scaleX(1)",
                        transformOrigin: "bottom left"
                      }
                    }}
                  >
                    Sign up
                  </Box>
                </Typography>
              </motion.div>
            </GlassCard>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
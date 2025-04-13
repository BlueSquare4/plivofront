// src/pages/signup.tsx
"use client"

import React, { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"

import { motion } from "framer-motion"
import {
  alpha,
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
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

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiFormLabel-root": {
    color: alpha(theme.palette.primary.main, 0.9),
    fontWeight: 500,
  }
}))

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

const GradientButton = styled(Button)(() => ({
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
    button: { 
      fontFamily: '"Inter", sans-serif',
      textTransform: "none", 
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#844FFF",
          "&.Mui-checked": {
            color: "#844FFF",
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        filled: {
          backgroundColor: "rgba(18, 16, 31, 0.5)",
          borderRadius: "12px",
        }
      }
    }
  }
})

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [accountType, setAccountType] = useState<"company"|"individual">("company")
  const [companySize, setCompanySize] = useState("")
  const [hobby, setHobby] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      alert("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: name })
      router.push("/login")
    } catch (err: any) {
      alert(err.message || "Signup failed")
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

  return (
    <ThemeProvider theme={genZTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0118 0%, #1A142F 100%)",
          py: 6,
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
              onSubmit={handleSubmit}
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
                <Typography
                  variant="h4"
                  align="center"
                  sx={{
                    mb: 4,
                    background: "linear-gradient(to right, #844FFF, #FF2FED)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  }}
                >
                  Create Your Account
                </Typography>
              </motion.div>

              {/* Form Fields */}
              {[
                { label: "Full Name", value: name, onChange: setName, type: "text" },
                { label: "Email", value: email, onChange: setEmail, type: "email" },
                { label: "Password", value: password, onChange: setPassword, type: "password" },
                { label: "Confirm Password", value: confirm, onChange: setConfirm, type: "password" },
              ].map(({ label, value, onChange, type }) => (
                <motion.div key={label} variants={itemVariants}>
                  <StyledTextField
                    label={label}
                    variant="filled"
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    required
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{ mb: 2.5 }}
                  />
                </motion.div>
              ))}

              {/* Account Type */}
              <motion.div variants={itemVariants}>
                <StyledFormControl fullWidth sx={{ mb: 2.5 }}>
                  <FormLabel>Account Type</FormLabel>
                  <RadioGroup
                    row
                    value={accountType}
                    onChange={e => setAccountType(e.target.value as any)}
                    sx={{ mt: 1 }}
                  >
                    <FormControlLabel value="company" control={<Radio />} label="Company" />
                    <FormControlLabel value="individual" control={<Radio />} label="Individual" />
                  </RadioGroup>
                </StyledFormControl>
              </motion.div>

              {/* Conditional dropdown */}
              <motion.div variants={itemVariants}>
                {accountType === "company" ? (
                  <StyledFormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel>Company Size</FormLabel>
                    <Select
                      value={companySize}
                      onChange={e => setCompanySize(e.target.value)}
                      required
                      variant="filled"
                      fullWidth
                      disableUnderline
                      sx={{
                        mt: 1,
                        background: alpha("#12101F", 0.4),
                        borderRadius: "12px",
                        "&:hover": {
                          background: alpha("#12101F", 0.6),
                        },
                        "&.Mui-focused": {
                          background: alpha("#12101F", 0.6),
                          boxShadow: `0 0 0 2px ${alpha(genZTheme.palette.primary.main, 0.25)}`
                        }
                      }}
                    >
                      <MenuItem value="1-10">1–10 employees</MenuItem>
                      <MenuItem value="11-50">11–50 employees</MenuItem>
                      <MenuItem value="51-200">51–200 employees</MenuItem>
                      <MenuItem value="201-500">201–500 employees</MenuItem>
                      <MenuItem value="501+">501+ employees</MenuItem>
                    </Select>
                  </StyledFormControl>
                ) : (
                  <StyledFormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel>Primary Interest</FormLabel>
                    <Select
                      value={hobby}
                      onChange={e => setHobby(e.target.value)}
                      required
                      variant="filled"
                      fullWidth
                      disableUnderline
                      sx={{
                        mt: 1,
                        background: alpha("#12101F", 0.4),
                        borderRadius: "12px",
                        "&:hover": {
                          background: alpha("#12101F", 0.6),
                        },
                        "&.Mui-focused": {
                          background: alpha("#12101F", 0.6),
                          boxShadow: `0 0 0 2px ${alpha(genZTheme.palette.primary.main, 0.25)}`
                        }
                      }}
                    >
                      <MenuItem value="development">Software Development</MenuItem>
                      <MenuItem value="design">Design</MenuItem>
                      <MenuItem value="marketing">Marketing</MenuItem>
                      <MenuItem value="business">Business</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </StyledFormControl>
                )}
              </motion.div>

              {/* Submit Button with Animation */}
              <motion.div variants={itemVariants}>
                <GradientButton
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                  component={motion.button}
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
                      <Typography>Creating Account...</Typography>
                    </motion.div>
                  ) : (
                    "Join Now"
                  )}
                </GradientButton>
              </motion.div>

              {/* Sign in link */}
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
                  Already have an account?{" "}
                  <Box
                    component={Link}
                    href="/login"
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
                    Sign in
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
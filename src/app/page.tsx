"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import ServiceCard from "../components/ui/ServiceCard";
import { Card } from "@/components/ui/card";
import EmptyState from "../components/EmptyState";
import socket from "@/lib/socket";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { Box, Container, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import WebsiteChecker from "../components/ui/WebsiteChecker";


// Animation variants (matching the signup vibe)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

// Styled glass card (glassmorphism container)
const GlassCard = styled(motion.div)(({ theme }) => ({
  position: "relative",
  background: "rgba(12, 10, 29, 0.65)",
  backdropFilter: "blur(12px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  overflow: "hidden",
  padding: theme.spacing(5),
}));

// Neon border styled component
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
});

// Modern Gen Z theme (same as in signup.tsx)
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
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        filled: {
          backgroundColor: "rgba(18, 16, 31, 0.5)",
          borderRadius: "12px",
        },
      },
    },
  },
});

// Animated background meshes (similar to signup.tsx)
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
];

type Service = { id: number; name: string; status: string; };
type Incident = { id: number; title: string; description: string; is_resolved: boolean; };
type Maintenance = { id: number; title: string; scheduled_start: string; scheduled_end: string; is_completed: boolean; };

export default function HomePage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  // This effect ensures the user is authenticated before fetching data.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        fetchData();
      }
    });
    return unsub;
  }, [router]);

  // Fetch data using an authorization header with the user's Firebase token.
  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [s, i, m] = await Promise.all([
        axios.get<Service[]>("/services/", { headers }),
        axios.get<Incident[]>("/incidents/", { headers }),
        axios.get<Maintenance[]>("/maintenances/", { headers }),
      ]);

      setServices(s.data);
      setIncidents(i.data);
      setMaintenances(m.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 10000);

    socket.on("connect", () => console.log("Socket.IO connected"));
    socket.on("status_update", (data: any) => {
      console.log("WS Data:", data);

      if (data.type === "instance") {
        if (data.action === "created") {
          setServices((prev) => [...prev, data.data]);
        } else if (data.action === "updated") {
          setServices((prev) =>
            prev.map((s) => (s.id === data.data.id ? { ...s, ...data.data } : s))
          );
        } else if (data.action === "deleted") {
          setServices((prev) => prev.filter((s) => s.id !== data.data.id));
        }
      } else {
        fetchData();
      }
    });

    return () => {
      clearInterval(interval);
      socket.off("status_update");
      socket.disconnect();
    };
  }, []);

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
        {/* Background animated meshes */}
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

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <GlassCard
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <NeonBorder
                animate={{
                  background: [
                    "linear-gradient(45deg, #FF2FED, #844FFF, #4a9fff)",
                    "linear-gradient(190deg, #4a9fff, #844FFF, #FF2FED)",
                    "linear-gradient(320deg, #844FFF, #4a9fff, #FF2FED)",
                    "linear-gradient(45deg, #FF2FED, #844FFF, #4a9fff)",
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div variants={itemVariants}>
                <Typography variant="h4" align="center" sx={{
                  mb: 4,
                  background: "linear-gradient(to right, #844FFF, #FF2FED)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                }}>
                  Service Status
                </Typography>
              </motion.div>

              {/* Website Checker */}
              <motion.div variants={itemVariants} className="mb-6">
                <WebsiteChecker />
              </motion.div>

              {/* Services Section */}
              <motion.div variants={itemVariants}>
                {services.length === 0 ? (
                  <EmptyState
                    message="You have no services yet."
                    cta="Create a Service"
                    href="/admin"
                  />
                ) : (
                  services.map((svc) => (
                    <ServiceCard key={svc.id} name={svc.name} status={svc.status} />
                  ))
                )}
              </motion.div>




              {/* Active Incidents Section */}
              <Box
                component={motion.div}
                variants={itemVariants}
                sx={{ mt: 6 }}
              >
                <Typography variant="h4" sx={{
                  mb: 2,
                  background: "linear-gradient(to right, #844FFF, #FF2FED)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Active Incidents
                </Typography>
                {incidents.filter((i) => !i.is_resolved).length === 0 ? (
                  <Typography sx={{ color: "gray" }}>No active incidents</Typography>
                ) : (
                  incidents.filter((i) => !i.is_resolved).map((incident) => (
                    <Card key={incident.id} className="p-4 mt-2">
                      <strong>{incident.title}</strong> — {incident.description}
                    </Card>
                  ))
                )}
              </Box>

              {/* Scheduled Maintenance Section */}
              <Box
                component={motion.div}
                variants={itemVariants}
                sx={{ mt: 6 }}
              >
                <Typography variant="h4" sx={{
                  mb: 2,
                  background: "linear-gradient(to right, #844FFF, #FF2FED)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Scheduled Maintenance
                </Typography>
                {maintenances.filter((m) => !m.is_completed).length === 0 ? (
                  <Typography sx={{ color: "gray" }}>No scheduled maintenance</Typography>
                ) : (
                  maintenances.filter((m) => !m.is_completed).map((maintenance) => (
                    <Card key={maintenance.id} className="p-4 mt-2">
                      <strong>{maintenance.title}</strong>
                      <br />
                      From {new Date(maintenance.scheduled_start).toLocaleString()} to{" "}
                      {new Date(maintenance.scheduled_end).toLocaleString()}
                    </Card>
                  ))
                )}
              </Box>
            </GlassCard>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

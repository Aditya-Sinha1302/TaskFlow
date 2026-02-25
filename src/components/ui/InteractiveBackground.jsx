import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const InteractiveBackground = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = useMemo(
        () => ({
            fullScreen: { enable: false, zIndex: 0 },
            background: {
                color: {
                    value: "transparent",
                },
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "grab",
                        parallax: {
                            enable: true,
                            force: 60,
                            smooth: 10
                        }
                    },
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    grab: {
                        distance: 250,
                        links: {
                            opacity: 0.9,
                            color: "#818CF8"
                        }
                    },
                },
            },
            particles: {
                color: {
                    value: ["#6366F1", "#A855F7", "#EC4899", "#E0E7FF"],
                },
                links: {
                    color: "#4F46E5",
                    distance: 140,
                    enable: true,
                    opacity: 0.25,
                    width: 1.5,
                    triangles: {
                        enable: true,
                        opacity: 0.05
                    }
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "out",
                    },
                    random: true,
                    speed: { min: 0.5, max: 1.5 },
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 120, // High density for the network feel
                },
                opacity: {
                    value: 0.7,
                    animation: {
                        enable: true,
                        speed: 1,
                        minimumValue: 0.1,
                    }
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 3.5 },
                    animation: {
                        enable: true,
                        speed: 2,
                        minimumValue: 1,
                    }
                },
            },
            detectRetina: true,
        }),
        [],
    );

    if (init) {
        return (
            <Particles
                id="tsparticles"
                options={options}
                className="absolute inset-0 z-0 pointer-events-auto mix-blend-screen"
                style={{ width: '100%', height: '100%' }}
            />
        );
    }

    return null;
};

export default InteractiveBackground;

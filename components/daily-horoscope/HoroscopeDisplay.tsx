import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from 'contentful'; // ✨ 1. Import Contentful client

// --- Contentful Client Initialization ---
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

// --- 1. Global Styles (Unchanged) ---
const GlobalStyle = createGlobalStyle`
  body {
    background-color: white;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

// --- 2. Data Type Interface (Unchanged) ---
interface ZodiacSign {
  name: string;
  imageUrl: string;
}

// --- 3. Styled Components (Unchanged) ---
const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-family: 'Playfair Display', serif;
  font-size: 2.8em;
  margin-bottom: 50px;
  letter-spacing: 1px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  justify-items: center;
`;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  box-shadow: 8px 8px 15px rgba(251, 146, 60, 0.5), 
              -8px -8px 15px rgba(255, 200, 150, 0.8);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 320px;
  position: relative;
  z-index: 2;
`;

const CardImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin-bottom: 15px;
  border-radius: 50%;
  background-color: #f8f8f8;
  padding: 10px;
  box-shadow: inset 2px 2px 5px #d1d1d1, inset -2px -2px 5px #ffffff;
`;

const CardName = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.6em;
  color: #444;
  margin-top: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ImageZoomContainer = styled(motion.div)`
  position: absolute;
  inset: 0;
`;

const HoverBackgroundImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DetailsPanel = styled(motion.div)`
  margin-top: 15px;
  background: white;
  padding: 18px;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const DetailsText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 0.95em;
  line-height: 1.6;
  color: #333;
  margin: 0 0 10px 0;
`;

const MoreButton = styled.a`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 22px;
  border-radius: 50px;
  font-size: 0.95em;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background: #ff4757;
  }
`;

// --- 4. HoroscopeDisplay Component (Updated with Data Fetching) ---
export const HoroscopeDisplay: React.FC = () => {
  // ✨ 2. Add state for fetched data and loading status
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);

  // ✨ 3. Fetch data from Contentful when the component mounts
  useEffect(() => {
    setIsLoading(true);
    client.getEntries<any>({
        content_type: 'zodiacSigns' // 👈 REPLACE with your Content Type ID
      })
      .then((response) => {
        if (response.items) {
          const fetchedSigns: ZodiacSign[] = response.items.map((item: any) => ({
            name: item.fields.signName, // 👈 REPLACE with your sign name Field ID
            imageUrl: `https:${item.fields.image.fields.file.url}` // 👈 REPLACE with your image Field ID
          }));
          setZodiacSigns(fetchedSigns);
        }
      })
      .catch(error => console.error("Error fetching data from Contentful:", error))
      .finally(() => setIsLoading(false));
  }, []); // Empty array ensures this runs only once on mount

  const getHoroscopeDetails = (signName: string) => {
    // ... (This function remains unchanged)
    switch (signName) {
      case 'Aries': return "Pioneers of the zodiac, brave and impulsive. Ruled by Mars, they are natural leaders full of energy.";
      case 'Taurus': return "Grounded and sensual, they appreciate beauty and stability. Ruled by Venus, they are loyal and patient.";
      case 'Gemini': return "The communicators of the zodiac, witty and adaptable. Ruled by Mercury, they are curious and social.";
      case 'Cancer': return "Nurturing and emotional, deeply connected to home. Ruled by the Moon, they are empathetic and protective.";
      case 'Leo': return "Majestic leaders, confident and generous. Ruled by the Sun, they are passionate and theatrical.";
      case 'Virgo': return "Practical and analytical, they strive for perfection. Ruled by Mercury, they are hardworking and meticulous.";
      case 'Libra': return "Seekers of balance and harmony, they value fairness. Ruled by Venus, they are charming and diplomatic.";
      case 'Scorpio': return "Intense and mysterious, deeply emotional and transformative. Ruled by Pluto, they are powerful and loyal.";
      case 'Sagittarius': return "Adventurous and optimistic, they seek truth. Ruled by Jupiter, they are philosophical and free-spirited.";
      case 'Capricorn': return "Ambitious and disciplined, masters of self-control. Ruled by Saturn, they are responsible and practical.";
      case 'Aquarius': return "Visionary and independent, the humanitarians of the zodiac. Ruled by Uranus, they are progressive and original.";
      case 'Pisces': return "Dreamy and compassionate, the healers and artists. Ruled by Neptune, they are empathetic and intuitive.";
      default: return "No details available for this sign yet.";
    }
  };

  // ✨ 4. Add a loading state for better UX
  if (isLoading) {
    return (
        <Container>
            <Title>Loading Zodiac Signs...</Title>
        </Container>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Grid>
          {zodiacSigns.map((sign) => (
            <CardWrapper
              key={sign.name}
              onMouseEnter={() => setHoveredSign(sign.name)}
              onMouseLeave={() => setHoveredSign(null)}
            >
              {/* Card */}
              <Card>
                <CardImage src={sign.imageUrl} alt={sign.name} />
                <CardName>{sign.name}</CardName>

                <AnimatePresence>
                  {hoveredSign === sign.name && (
                    <ImageZoomContainer
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <HoverBackgroundImage
                        src={sign.imageUrl}
                        alt={`${sign.name} background`}
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.15 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </ImageZoomContainer>
                  )}
                </AnimatePresence>
              </Card>

              {/* Panel Below */}
              <AnimatePresence>
                {hoveredSign === sign.name && (
                  <DetailsPanel
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    <DetailsText>{getHoroscopeDetails(sign.name)}</DetailsText>
                    <MoreButton href={`/horoscopes/${sign.name.toLowerCase()}`}>
                      View
                    </MoreButton>
                  </DetailsPanel>
                )}
              </AnimatePresence>
            </CardWrapper>
          ))}
        </Grid>
      </Container>
    </>
  );
};
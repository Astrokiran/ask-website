"use client"

import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { createClient } from 'contentful'; // ✨ 1. Import Contentful client

// --- Contentful Client Initialization ---
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

// --- 1. Global Styles (Dark Mode Compatible) ---
const GlobalStyle = createGlobalStyle`
  body {
    background-color: hsl(var(--background));
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

const zodiacOrder = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// --- 3. Styled Components (Unchanged) ---
const Container = styled.div`
  max-width: 1400px;
  margin: 20px auto;
  padding: 16px;
  background-color: hsl(var(--background));
  border-radius: 10px;
`;

const Title = styled.h1`
  text-align: center;
  color: hsl(var(--foreground));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 2em;
  font-weight: 600;
  margin-bottom: 30px;
  letter-spacing: -0.025em;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  justify-items: center;
  max-width: 400px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 18px;
    max-width: none;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 20px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }
`;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 180px;

  @media (min-width: 768px) {
    max-width: 200px;
  }
`;

const Card = styled.a`
  background: hsl(var(--card));
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid hsl(var(--border));
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 160px;
  position: relative;
  z-index: 2;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: rgb(251 146 60);
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    height: 180px;
  }

  @media (min-width: 1024px) {
    height: 200px;
  }
`;

const CardImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 6px;
  border-radius: 50%;
  background-color: hsl(var(--muted));
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid hsl(var(--border));

  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
    margin-bottom: 8px;
  }

  @media (min-width: 1024px) {
    width: 120px;
    height: 120px;
    margin-bottom: 10px;
  }
`;

const CardName = styled.h3`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 0.95em;
  color: hsl(var(--foreground));
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.025em;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.1em;
  }

  @media (min-width: 1024px) {
    font-size: 1.2em;
  }
`;

// Removed ImageZoomContainer, HoverBackgroundImage, DetailsPanel, DetailsText, and MoreButton
// as we're simplifying the hover effects and making cards directly clickable

// --- 4. HoroscopeDisplay Component (Updated with Data Fetching) ---
export const HoroscopeDisplay: React.FC = () => {
  // ✨ 2. Add state for fetched data and loading status
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    client.getEntries<any>({
        content_type: 'zodiacSigns' 
      })
      .then((response) => {
        if (response.items) {
          const fetchedSigns: ZodiacSign[] = response.items.map((item: any) => ({
            name: item.fields.signName, // 
            imageUrl: `https:${item.fields.image.fields.file.url}` 
          }));
          fetchedSigns.sort((a, b) => {
            return zodiacOrder.indexOf(a.name) - zodiacOrder.indexOf(b.name);
          });
          setZodiacSigns(fetchedSigns);
        }
      })
      .catch(error => console.error("Error fetching data from Contentful:", error))
      .finally(() => setIsLoading(false));
  }, []); // Empty array ensures this runs only once on mount


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
            <CardWrapper key={sign.name}>
              {/* Card - Now clickable */}
              <Card href={`/horoscopes/${sign.name.toLowerCase()}`}>
                <CardImage src={sign.imageUrl} alt={sign.name} />
                <CardName>{sign.name}</CardName>
              </Card>
            </CardWrapper>
          ))}
        </Grid>
      </Container>
    </>
  );
};
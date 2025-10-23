"use client"

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguageStore } from '@/stores/languageStore';
import { LanguageSelector } from '@/components/ui/language-selector';
import Link from 'next/link';

// --- Interface for Horoscope Data ---
interface HoroscopeData {
  success: boolean;
  sign: string;
  date: string;
  language: string;
  horoscope: {
    overview: {
      narrative: string;
      reason: string;
    };
    love_and_relationships: {
      narrative: string;
      reason: string;
    };
    career_and_finance: {
      narrative: string;
      reason: string;
    };
    emotions_and_mind: {
      narrative: string;
      reason: string;
    };
    travel_and_movement: {
      narrative: string;
      reason: string;
    };
    remedies: {
      narrative: string;
      reason: string;
    };
    lucky_insights: {
      mood: string;
      lucky_color: string;
      lucky_number: number;
      lucky_time: string;
    };
  };
}

interface LoadingCard {
  sign: string;
  isLoading: boolean;
  error?: string;
}

const zodiacOrder = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// --- Styled Components ---
const Container = styled.div`
  max-width: 1400px;
  margin: 20px auto;
  padding: 16px;
  background-color: hsl(var(--background));
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: hsl(var(--foreground));
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 2em;
  font-weight: 600;
  margin: 0;
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
  width: 100%;
  max-width: 160px;
`;

const Card = styled(Link)`
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
  border: 2px solid hsl(var(--border));
  border-radius: 12px;
  background-color: hsl(var(--card));
  cursor: pointer;

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

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 2rem;
`;

const CardName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  color: hsl(var(--foreground));
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid hsl(var(--border));
  border-top: 2px solid hsl(var(--primary));
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorIcon = styled.div`
  color: hsl(var(--destructive));
  font-size: 1.5rem;
`;

// Zodiac icons (using emoji as fallback)
const getZodiacIcon = (sign: string): string => {
  const icons: { [key: string]: string } = {
    "Aries": "♈",
    "Taurus": "♉",
    "Gemini": "♊",
    "Cancer": "♋",
    "Leo": "♌",
    "Virgo": "♍",
    "Libra": "♎",
    "Scorpio": "♏",
    "Sagittarius": "♐",
    "Capricorn": "♑",
    "Aquarius": "♒",
    "Pisces": "♓"
  };
  return icons[sign] || "✨";
};

// --- HoroscopeDisplay Component ---
export const HoroscopeDisplay: React.FC = () => {
  const { language } = useLanguageStore();
  const [loadingCards, setLoadingCards] = useState<LoadingCard[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  // Initialize loading cards
  useEffect(() => {
    const cards = zodiacOrder.map(sign => ({
      sign,
      isLoading: true,
    }));
    setLoadingCards(cards);

    // Simulate initial loading
    setTimeout(() => {
      setInitialLoad(false);
    }, 1000);
  }, []);

  return (
    <Container>
      <Header>
        <Title>
          {language === 'hi' ? 'दैनिक राशिफल' : 'Daily Horoscope'}
        </Title>
        <LanguageSelector />
      </Header>

      {initialLoad ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>
            {language === 'hi' ? 'राशिफल लोड हो रहा है...' : 'Loading horoscopes...'}
          </p>
        </div>
      ) : (
        <Grid>
          {zodiacOrder.map((sign) => (
            <CardWrapper key={sign}>
              <Card href={`/horoscopes/${sign.toLowerCase()}`}>
                <CardIcon>{getZodiacIcon(sign)}</CardIcon>
                <CardName>{sign}</CardName>
              </Card>
            </CardWrapper>
          ))}
        </Grid>
      )}
    </Container>
  );
};
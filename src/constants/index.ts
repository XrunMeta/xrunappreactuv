
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  text: '#000000',
  error: '#FF3B30',
  success: '#34C759',

  buttonPrimary: '#343a5a',
  buttonSecondary: '#ffdc04',

  headerText: '#10192d',
  headerIconBg: '#F8FAFC',
};

export const SIZES = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

export const COMMON_STYLES = {

  bottomSection: {
    width: '100%' as const,
    maxWidth: 780,
    alignSelf: 'center' as const,
    marginTop: 'auto' as const,
    paddingTop: SIZES.medium, 
    marginBottom: SIZES.large, 
  },
};

export { COUNTRY_DIAL_CODES } from './countryDialCodes';


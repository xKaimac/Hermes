export type ProviderName = 'google' | 'github' | 'discord';

export interface AuthProvider {
  name: ProviderName;
}

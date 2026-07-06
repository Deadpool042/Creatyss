/**
 * Retour utilisateur partagé pour les actions de pilotage des feature flags
 * (toggle, sélection de niveau). Affiché à la fois en toast (transitoire) et
 * en `Notice` inline (persistant jusqu'à la prochaine action), cf.
 * components/shared/feedback.
 */
export type FeatureFlagFeedback = {
  tone: "success" | "alert";
  message: string;
};

export type OnFeatureFlagFeedback = (feedback: FeatureFlagFeedback) => void;

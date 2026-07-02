import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { PropertyHighlight } from "./compositions/PropertyHighlight";
import { AgentBranding } from "./compositions/AgentBranding";
import { Building3DTour } from "./compositions/Building3DTour";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Original demo composition */}
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />

      {/* ImmoPro - First real composition (follows Remotion Skills + Pro Max design system) */}
      <Composition
        id="PropertyHighlight"
        component={PropertyHighlight}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          propertyTitle: "Villa Contemporaine - Bonapriso",
          location: "Douala, Cameroun",
          price: "285 000 000 FCFA",
          features: ["5 chambres", "Piscine", "Jardin clos", "Sécurité 24/7"],
        }}
      />

      {/* Agent Branding Video Template */}
      <Composition
        id="AgentBranding"
        component={AgentBranding}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          agentName: "Jean-Pierre Mbala",
          title: "Expert Immobilier Senior",
          tagline: "Votre partenaire de confiance pour les biens d'exception au Cameroun",
          yearsExperience: 12,
        }}
      />

      {/* 3D Virtual Tour Composition (Remotion Three + Paper & Ink) */}
      <Composition
        id="Building3DTour"
        component={Building3DTour}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          propertyTitle: "Villa Contemporaine",
          location: "Bonapriso, Douala",
        }}
      />
    </>
  );
};

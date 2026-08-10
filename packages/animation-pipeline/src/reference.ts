import invalidQaReport from "../examples/signal-atlas/fixtures/missing-asset-qa-report.json";
import assetManifest from "../examples/signal-atlas/generated/asset-manifest.json";
import implementationScaffold from "../examples/signal-atlas/generated/implementation-scaffold.json";
import provenanceManifest from "../examples/signal-atlas/generated/provenance-manifest.json";
import qaReport from "../examples/signal-atlas/generated/qa-report.json";
import storyboard from "../examples/signal-atlas/generated/storyboard.json";
import creativeBrief from "../examples/signal-atlas/source/creative-brief.json";
import productionDraft from "../examples/signal-atlas/source/production-draft.json";
import type {
  AssetManifest,
  CreativeBrief,
  ImplementationScaffold,
  ProductionDraft,
  ProvenanceManifest,
  QaReport,
  Storyboard,
} from "./schema.ts";

export const signalAtlasReference = {
  creativeBrief: creativeBrief as CreativeBrief,
  productionDraft: productionDraft as ProductionDraft,
  storyboard: storyboard as Storyboard,
  assetManifest: assetManifest as AssetManifest,
  implementationScaffold: implementationScaffold as ImplementationScaffold,
  qaReport: qaReport as QaReport,
  invalidQaReport: invalidQaReport as QaReport,
  provenanceManifest: provenanceManifest as ProvenanceManifest,
};

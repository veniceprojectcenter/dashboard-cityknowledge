import { WidgetInterface} from './widget-interface';

type coords = [number, number];

export interface DashboardInterface {
  name: string;
  helpDocUrl: string;
  helpDocHeight: number;
  helpDocWidth: number;
  pageTitle: string;
  coords: coords;
  widgetsInUse: string[];
}

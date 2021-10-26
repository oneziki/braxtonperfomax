import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { SafePipe } from './_pipes/safe.pipe';
import { SearchPipe } from './_pipes/search.pipe';

import { AppMenus } from './app-menus/app-menus.page';
import { AppHomePanel } from './app-menus/menu-panels/app-home-panel/app-home-panel.page';
import { AppPersonalPanel } from './app-menus/menu-panels/app-personal-panel/app-personal-panel.page';
import { AppTeamPanel } from './app-menus/menu-panels/app-team-panel/app-team-panel.page';
import { PerformPanel } from './app-menus/menu-panels/perform-panel/perform-panel.page';
import { GrowPanel } from './app-menus/menu-panels/grow-panel/grow-panel.page';
import { LivePanel } from './app-menus/menu-panels/live-panel/live-panel.page';
import { ChoosePage } from './app-menus/menu-panels/choose-panel/choose-panel.page';
import { AspirePage } from './app-menus/menu-panels/aspire-panel/aspire-panel.page';
import { CoachPage } from './app-menus/menu-panels/coach-panel/coach-panel.page';
import { MymaxReportingPanel } from './app-menus/menu-panels/mymax-reporting-panel/mymax-reporting-panel.page';
import { LoaderPage } from './loader/loader.page';

import { ChatBoxPage } from './chat-box/chat-box.page'; 

import { GraphHolderPage } from './graphHolder/graphHolder.page';

import { ActionTableComponent } from './graphHolder/graphs/data-table/data-table.component';
import { ArrowColumnComboComponent } from './graphHolder/graphs/arrow-column-combo/arrow-column-combo.component';
import { ArrowListComponent } from './graphHolder/graphs/arrow-list/arrow-list.component';
import { BarBenchmarkComponent } from './graphHolder/graphs/bar-benchmark/bar-benchmark.component';
import { BarListComponent } from './graphHolder/graphs/bar-list/bar-list.component';
import { CardListComponent } from './graphHolder/graphs/card-list/card-list.component';
import { CardStairwayComponent } from './graphHolder/graphs/card-stairway/card-stairway.component';
import { ColumnGridComponent } from './graphHolder/graphs/column-grid/column-grid.component';
import { CustomLayoutComponent } from './graphHolder/graphs/customlayout/customlayout.component';
import { HeatmapChartComponent } from './graphHolder/graphs/heatmap-chart/heatmap-chart.component';
import { HeatmapPodComponent } from './graphHolder/graphs/heatmap-chart/heatmap-pod/heatmap-pod.component';
import { HtmlTableComponent } from './graphHolder/graphs/html-table/html-table.component';
import { IconGroupListComponent } from './graphHolder/graphs/icon-group-list/icon-group-list.component';
import { IconLegendListComponent } from './graphHolder/graphs/icon-legend-list/icon-legend-list.component';
import { ImageDisplayerComponent } from './graphHolder/graphs/image-displayer/image-displayer.component';
import { MeasureListComponent } from './graphHolder/graphs/measure-list/measure-list.component';
import { PieListComponent } from './graphHolder/graphs/pie-list/pie-list.component';
import { StatusDisplayerComponent } from './graphHolder/graphs/status-displayer/status-displayer.component';

import { ModalsPage } from './modals/modals.page';
import { CardStairwayModalPage } from './modals/card-stairway-modal/card-stairway-modal';

import { StatusDisplayPage } from './graphHolder/graphs/status-display/status-display.page';
import { SimpleColumnGridPage } from './graphHolder/graphs/simple-column-grid/simple-column-grid.page';
import { ListTablePage } from './graphHolder/graphs/list-table/list-table.page';

import { DataTablesModule } from "angular-datatables";

import { AutosizeModal } from './_directives/autosize-modal.directive';
import { Autosize } from './_directives/autosize.directive';
import { MatchHeightDirective } from './_directives/match-height.directive';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, DataTablesModule],
  declarations: [
    AppMenus,
    ChatBoxPage,
    LoaderPage,
    AppHomePanel,
    AppPersonalPanel,
    AppTeamPanel,
    PerformPanel,
    GrowPanel,
    LivePanel,
    ChoosePage,
    AspirePage,
    CoachPage,
    MymaxReportingPanel,
    SafePipe,
    SearchPipe,
    GraphHolderPage,
    StatusDisplayPage,
    SimpleColumnGridPage,
    ListTablePage,
    ActionTableComponent,
    ArrowColumnComboComponent,
    ArrowListComponent,
    BarBenchmarkComponent,
    BarListComponent,
    CardListComponent,
    CardStairwayComponent,
    ColumnGridComponent,
    CustomLayoutComponent,
    HeatmapChartComponent,
    HeatmapPodComponent,
    HtmlTableComponent,
    IconGroupListComponent,
    IconLegendListComponent,
    ImageDisplayerComponent,
    MeasureListComponent,
    PieListComponent,
    StatusDisplayerComponent,
    ModalsPage,
    CardStairwayModalPage,
    AutosizeModal,
    Autosize,
    MatchHeightDirective],
  exports: [
    AppMenus,
    ChatBoxPage,
    LoaderPage,
    AppHomePanel,
    AppPersonalPanel,
    AppTeamPanel,
    PerformPanel,
    GrowPanel,
    LivePanel,
    MymaxReportingPanel,
    SafePipe,
    SearchPipe,
    GraphHolderPage,
    StatusDisplayPage,
    SimpleColumnGridPage,
    ListTablePage,
    ActionTableComponent,
    ArrowColumnComboComponent,
    ArrowListComponent,
    BarBenchmarkComponent,
    BarListComponent,
    CardListComponent,
    CardStairwayComponent,
    ColumnGridComponent,
    CustomLayoutComponent,
    HeatmapChartComponent,
    HeatmapPodComponent,
    HtmlTableComponent,
    IconGroupListComponent,
    IconLegendListComponent,
    ImageDisplayerComponent,
    MeasureListComponent,
    PieListComponent,
    StatusDisplayerComponent,
    ModalsPage,
    CardStairwayModalPage,
    AutosizeModal,
    Autosize,
    MatchHeightDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }

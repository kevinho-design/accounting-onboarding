import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  X,
  LayoutDashboard,
  GripVertical,
  Check,
  Plus,
  AlertCircle,
  Trash2,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Input } from './ui/input';
import {
  WIDGET_CATALOG,
  FinanceWidgetContent,
  hydratePlacedWidgets,
  financePageWidgetsFromHydrated,
  financeSidebarWidgetsForPersist,
  hydrateSidebarPlacedWidgets,
  layoutSizeToGridClass,
  mainGridClass,
  defaultLayoutSizeForWidgetId,
  EMBEDDED_REPORT_WIDGET_ID,
  ReportViewToolbar,
  type FinancePageWidget,
  type HydratedPlacedWidget,
  type ReportLibraryEntry,
  type ReportWidgetView,
  type MainGridColumns,
  type ModellingWidgetUiBridge,
  type FinanceWidgetExplorePayload,
  isFinancialHealthOverviewWidgetId,
} from './financeWidgetCatalog';
import { getFinanceWidgetExploreAction } from '../data/financeWidgetDrillDown';
import type { LucideIcon } from 'lucide-react';
import { FileText } from 'lucide-react';
import { buildBriefingFinancialSnapshot } from '../data/briefingFinancialImpact';
import type { StrategicMonthRow } from '../data/strategicDashboardSeed';
import type { PeerBenchmarkPageContext } from '../data/peerBenchmarkSeries';
import type { BriefingInsightId } from '../data/briefingPanelContent';
import type { DigitalTwinScenarioId } from './DigitalTwinWidget';
import { StrategicDashboardChartsProvider } from '../context/StrategicDashboardChartsContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const ItemTypes = {
  WIDGET: 'widget',
  CANVAS_MAIN: 'canvas_main',
  CANVAS_SIDEBAR: 'canvas_sidebar',
};

export type FinanceDashboardSavePayload = {
  title: string;
  widgets: FinancePageWidget[];
  sidebarWidgets: FinancePageWidget[];
  mainGridColumns: MainGridColumns;
  /** When false, live page uses full-width main and hides the right rail. */
  showSidebar: boolean;
};

type CanvasWidgetItem = HydratedPlacedWidget;

type SortableCanvasWidgetProps = {
  widget: CanvasWidgetItem;
  index: number;
  canvasList: 'main' | 'sidebar';
  canvasDragType: string;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  removeWidget: (instanceId: string) => void;
  toggleLayoutSize?: (instanceId: string) => void;
  onReportViewChange: (instanceId: string, reportView: ReportWidgetView) => void;
  onTakeAction?: (insightId: string) => void;
  onExploreData?: (insightId: string) => void;
  executedBriefingInsightIds?: readonly BriefingInsightId[];
  onDigitalTwinScenario?: (id: DigitalTwinScenarioId) => void;
  mainGridColumns?: MainGridColumns;
  modellingUi?: ModellingWidgetUiBridge | null;
  onFinanceWidgetExplore?: (payload: FinanceWidgetExplorePayload) => void;
};

function SortableCanvasWidget({
  widget,
  index,
  canvasList,
  canvasDragType,
  moveWidget,
  removeWidget,
  toggleLayoutSize,
  onReportViewChange,
  onTakeAction,
  onExploreData,
  executedBriefingInsightIds,
  onDigitalTwinScenario,
  mainGridColumns = 2,
  modellingUi,
  onFinanceWidgetExplore,
}: SortableCanvasWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: canvasDragType,
    item: () => ({ index, instanceId: widget.instanceId, list: canvasList }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: canvasDragType,
    hover(item: { index: number; instanceId: string; list: string }, monitor) {
      if (!ref.current) return;
      if (item.list !== canvasList) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  dropRef(ref);

  const spanClass =
    canvasList === 'main' ? layoutSizeToGridClass(widget.layoutSize, mainGridColumns) : '';

  const headerGap =
    widget.id === 'ambient_cfo' ||
    isFinancialHealthOverviewWidgetId(widget.id) ||
    widget.id === 'suggested_modelling' ||
    widget.id === 'digital_twin'
      ? 'mb-0 z-10 relative'
      : 'mb-2';

  return (
    <div
      ref={ref}
      className={`bg-white rounded-[12px] shadow-sm border border-gray-200 p-5 flex flex-col relative group animate-in zoom-in-95 duration-200 ${spanClass} overflow-hidden ${
        isDragging ? 'opacity-40 ring-2 ring-blue-400 ring-offset-2 z-10' : ''
      }`}
    >
      <div className={`flex items-start justify-between ${headerGap}`}>
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            ref={(node) => {
              dragRef(node);
            }}
            className="p-1 -ml-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-grab active:cursor-grabbing touch-none"
            title="Drag to reorder"
            aria-label="Drag to reorder widget"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          {widget.id === 'ambient_cfo' ||
          isFinancialHealthOverviewWidgetId(widget.id) ||
          widget.id === 'digital_twin' ? null : widget.id ===
          'suggested_modelling' ? (
            <h3 className="text-[14px] font-bold text-gray-900 truncate flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              Modelling
            </h3>
          ) : (
            <h3 className="text-[14px] font-bold text-gray-900 truncate">{widget.title}</h3>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 relative z-10">
          {canvasList === 'main' && toggleLayoutSize && (
            <>
              <span
                className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-[4px] border mr-0.5 ${
                  widget.layoutSize === 'expanded'
                    ? 'text-blue-700 bg-blue-50 border-blue-100'
                    : 'text-gray-600 bg-gray-50 border-gray-200'
                }`}
              >
                {widget.layoutSize === 'expanded' ? 'Expanded' : 'Compact'}
              </span>
              <button
                type="button"
                onClick={() => toggleLayoutSize(widget.instanceId)}
                className="text-gray-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                title={
                  widget.layoutSize === 'expanded'
                    ? 'Switch to compact width (half row on large screens)'
                    : 'Expand to full row width'
                }
                aria-label={
                  widget.layoutSize === 'expanded' ? 'Use compact widget width' : 'Expand widget to full width'
                }
              >
                {widget.layoutSize === 'expanded' ? (
                  <Minimize2 className="w-4 h-4" strokeWidth={1.75} />
                ) : (
                  <Maximize2 className="w-4 h-4" strokeWidth={1.75} />
                )}
              </button>
            </>
          )}
          {canvasList === 'sidebar' && (
            <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-[4px] border text-gray-500 bg-gray-50 border-gray-200 mr-0.5">
              Sidebar
            </span>
          )}
          <button
            type="button"
            onClick={() => removeWidget(widget.instanceId)}
            className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors"
            aria-label="Remove widget"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {widget.id === 'suggested_modelling' && (
        <p className="text-[11px] text-gray-500 mb-2 -mt-1 pl-7">{widget.desc}</p>
      )}

      <ReportViewToolbar
        className="mb-2"
        value={widget.reportView ?? 'chart_compact'}
        onChange={(v) => onReportViewChange(widget.instanceId, v)}
      />

      <div className="flex-1 text-gray-600 text-sm min-w-0">
        <FinanceWidgetContent
          id={widget.id}
          instanceId={widget.instanceId}
          onTakeAction={onTakeAction}
          onExploreData={onExploreData}
          executedBriefingInsightIds={executedBriefingInsightIds}
          reportName={widget.reportName}
          reportView={widget.reportView}
          onDigitalTwinScenario={onDigitalTwinScenario}
          modellingUi={widget.id === 'suggested_modelling' ? modellingUi : undefined}
        />
      </div>
      {onFinanceWidgetExplore ? (() => {
        const exploreAction = getFinanceWidgetExploreAction(widget.id, {
          reportName: widget.reportName,
        });
        if (exploreAction.type === 'noop') return null;
        return (
          <div className="mt-4 border-t border-gray-200 pt-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                onFinanceWidgetExplore({
                  widgetId: widget.id,
                  reportName: widget.reportName,
                  fallbackTitle: widget.title,
                })
              }
              className="flex w-full min-h-11 items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <span>{exploreAction.label}</span>
              <ChevronRight className="size-4 shrink-0 opacity-70" aria-hidden />
            </button>
          </div>
        );
      })() : null}
    </div>
  );
}

const LibraryItem = ({ item }: { item: (typeof WIDGET_CATALOG)[number] }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.WIDGET,
    item: { id: item.id } as { id: string; reportName?: string },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => dragRef(node) as any}
      className={`p-3 rounded-[8px] border border-gray-200 bg-white mb-3 cursor-grab hover:border-blue-400 hover:shadow-sm transition-all group flex items-start gap-3 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="w-8 h-8 rounded-[6px] bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        <item.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
      </div>
      <div>
        <h4 className="text-[13px] font-semibold text-gray-900 leading-tight mb-1">{item.title}</h4>
        <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
};

function ReportLibraryItem({ name, desc, icon: Icon }: { name: string; desc: string; icon: LucideIcon }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.WIDGET,
    item: { id: EMBEDDED_REPORT_WIDGET_ID, reportName: name } as { id: string; reportName?: string },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => dragRef(node) as unknown as void}
      className={`p-3 rounded-[8px] border border-gray-200 bg-white mb-3 cursor-grab hover:border-violet-400 hover:shadow-sm transition-all group flex items-start gap-3 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="w-8 h-8 rounded-[6px] bg-violet-50 flex items-center justify-center border border-violet-100 shrink-0 group-hover:bg-violet-100 transition-colors">
        <Icon className="w-4 h-4 text-violet-600" />
      </div>
      <div>
        <h4 className="text-[13px] font-semibold text-gray-900 leading-tight mb-1">{name}</h4>
        <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export const DashboardCustomizerContent = ({
  onClose,
  onTakeAction,
  onExploreData,
  mode,
  dashboardTitle,
  initialWidgets,
  initialSidebarWidgets,
  initialShowSidebar,
  reportLibrary,
  onSaveDashboard,
  onDeleteDashboard,
  executedBriefingInsightIds,
  onDigitalTwinScenario,
  getCustomizerStrategicRows,
  modellingWidgetModels,
  financialGoalModelIds,
  onModellingExplore,
  onModellingOpenCreateModel,
  initialPeerBenchmarkEnabled,
  onFinanceWidgetExplore,
}: {
  onClose: () => void;
  onTakeAction?: (insightId: string) => void;
  onExploreData?: (insightId: string) => void;
  mode: 'create' | 'edit';
  dashboardTitle: string;
  initialWidgets: FinancePageWidget[];
  initialSidebarWidgets: FinancePageWidget[];
  initialShowSidebar: boolean;
  reportLibrary: readonly ReportLibraryEntry[];
  onSaveDashboard: (payload: FinanceDashboardSavePayload) => void;
  onDeleteDashboard: () => void;
  executedBriefingInsightIds?: readonly BriefingInsightId[];
  onDigitalTwinScenario?: (id: DigitalTwinScenarioId) => void;
  getCustomizerStrategicRows?: (
    previewModelId: string | null,
    peerBenchmarkEnabled: boolean,
    peerPageContext: PeerBenchmarkPageContext | null,
  ) => StrategicMonthRow[];
  modellingWidgetModels: ModellingWidgetUiBridge['models'];
  financialGoalModelIds: readonly string[];
  onModellingExplore: (modelId: string) => void;
  onModellingOpenCreateModel: () => void;
  initialPeerBenchmarkEnabled?: boolean;
  onFinanceWidgetExplore?: (payload: FinanceWidgetExplorePayload) => void;
}) => {
  /** Customizer always uses a 2-column main grid (matches live Finances layout). */
  const mainGridColumns: MainGridColumns = 2;

  const [draftDashboardTitle, setDraftDashboardTitle] = useState(dashboardTitle);
  const [draftShowSidebar, setDraftShowSidebar] = useState(initialShowSidebar);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  useEffect(() => {
    setDraftDashboardTitle(dashboardTitle);
  }, [dashboardTitle]);

  useEffect(() => {
    setDraftShowSidebar(initialShowSidebar);
  }, [initialShowSidebar]);

  const deleteNameMatches = deleteConfirmInput === dashboardTitle;

  const [previewModelId, setPreviewModelId] = useState<string | null>(null);
  const [peerBenchmarkDraft, setPeerBenchmarkDraft] = useState(() => initialPeerBenchmarkEnabled ?? false);

  const briefingSnap = useMemo(
    () => buildBriefingFinancialSnapshot(executedBriefingInsightIds ?? []),
    [executedBriefingInsightIds],
  );

  const [canvasMainWidgets, setCanvasMainWidgets] = useState(() =>
    hydratePlacedWidgets(initialWidgets, reportLibrary),
  );
  const [canvasSidebarWidgets, setCanvasSidebarWidgets] = useState(() =>
    hydrateSidebarPlacedWidgets(initialSidebarWidgets, reportLibrary),
  );

  useEffect(() => {
    setCanvasMainWidgets(hydratePlacedWidgets(initialWidgets, reportLibrary));
  }, [initialWidgets, reportLibrary]);

  useEffect(() => {
    setCanvasSidebarWidgets(hydrateSidebarPlacedWidgets(initialSidebarWidgets, reportLibrary));
  }, [initialSidebarWidgets, reportLibrary]);

  const mainWidgetIds = useMemo(() => canvasMainWidgets.map((w) => w.id), [canvasMainWidgets]);
  const sidebarWidgetIds = useMemo(
    () => (draftShowSidebar ? canvasSidebarWidgets.map((w) => w.id) : []),
    [canvasSidebarWidgets, draftShowSidebar],
  );

  const customizerPeerPageContext = useMemo(
    (): PeerBenchmarkPageContext => ({
      snapshot: briefingSnap,
      mainWidgetIds,
      sidebarWidgetIds,
    }),
    [briefingSnap, mainWidgetIds, sidebarWidgetIds],
  );

  const displayStrategicData = useMemo(() => {
    if (getCustomizerStrategicRows) {
      return getCustomizerStrategicRows(previewModelId, peerBenchmarkDraft, customizerPeerPageContext);
    }
    return briefingSnap.strategicRows;
  }, [
    getCustomizerStrategicRows,
    previewModelId,
    peerBenchmarkDraft,
    customizerPeerPageContext,
    briefingSnap.strategicRows,
  ]);

  const chartsValue = useMemo(
    () => ({
      displayStrategicData,
      selectedModelId: previewModelId,
      peerBenchmarkEnabled: peerBenchmarkDraft,
      briefingSnapshot: briefingSnap,
    }),
    [displayStrategicData, previewModelId, peerBenchmarkDraft, briefingSnap],
  );

  const modellingUi = useMemo(
    (): ModellingWidgetUiBridge => ({
      models: modellingWidgetModels,
      selectedModelId: previewModelId,
      onTogglePreview: (id) => setPreviewModelId((p) => (p === id ? null : id)),
      financialGoalModelIds,
      onExploreModel: onModellingExplore,
      onOpenCreateModel: onModellingOpenCreateModel,
      peerBenchmarkEnabled: peerBenchmarkDraft,
      onPeerBenchmarkChange: setPeerBenchmarkDraft,
    }),
    [
      modellingWidgetModels,
      previewModelId,
      financialGoalModelIds,
      onModellingExplore,
      onModellingOpenCreateModel,
      peerBenchmarkDraft,
    ],
  );

  const addReportToList = useCallback(
    (reportName: string, list: 'main' | 'sidebar') => {
      const meta = reportLibrary.find((r) => r.name === reportName);
      const instanceId = `w_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const rowMain: HydratedPlacedWidget = {
        id: EMBEDDED_REPORT_WIDGET_ID,
        title: reportName,
        desc: meta?.desc ?? 'Financial report',
        icon: meta?.icon ?? FileText,
        category: 'Reports',
        instanceId,
        layoutSize: 'expanded',
        reportName,
        reportView: 'chart_compact',
      };
      const rowSidebar: HydratedPlacedWidget = { ...rowMain, layoutSize: 'compact' };
      if (list === 'main') {
        setCanvasMainWidgets((prev) => [...prev, rowMain]);
      } else {
        setCanvasSidebarWidgets((prev) => [...prev, rowSidebar]);
      }
    },
    [reportLibrary],
  );

  const addCatalogToList = useCallback((id: string, list: 'main' | 'sidebar', reportName?: string) => {
    if (id === EMBEDDED_REPORT_WIDGET_ID && reportName) {
      addReportToList(reportName, list);
      return;
    }
    const catalogItem = WIDGET_CATALOG.find((w) => w.id === id);
    if (catalogItem) {
      const layoutSize = list === 'sidebar' ? ('compact' as const) : defaultLayoutSizeForWidgetId(id);
      const row: HydratedPlacedWidget = {
        ...catalogItem,
        instanceId: `w_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        layoutSize,
        reportView: 'chart_compact',
      };
      if (list === 'main') {
        setCanvasMainWidgets((prev) => [...prev, row]);
      } else {
        setCanvasSidebarWidgets((prev) => [...prev, row]);
      }
    }
  }, [addReportToList]);

  const addToMainRef = useRef<(id: string, reportName?: string) => void>(() => {});
  const addToSidebarRef = useRef<(id: string, reportName?: string) => void>(() => {});
  addToMainRef.current = (id, rn) => addCatalogToList(id, 'main', rn);
  addToSidebarRef.current = (id, rn) => addCatalogToList(id, 'sidebar', rn);

  const [{ isOverMain }, mainDropRef] = useDrop(() => ({
    accept: ItemTypes.WIDGET,
    drop: (item: { id: string; reportName?: string }) => addToMainRef.current(item.id, item.reportName),
    collect: (monitor) => ({
      isOverMain: monitor.isOver(),
    }),
  }));

  const [{ isOverSidebar }, sidebarDropRef] = useDrop(() => ({
    accept: ItemTypes.WIDGET,
    canDrop: () => draftShowSidebar,
    drop: (item: { id: string; reportName?: string }) => addToSidebarRef.current(item.id, item.reportName),
    collect: (monitor) => ({
      isOverSidebar: draftShowSidebar && monitor.isOver(),
    }),
  }));

  const removeWidget = useCallback((instanceId: string) => {
    setCanvasMainWidgets((prev) => prev.filter((w) => w.instanceId !== instanceId));
    setCanvasSidebarWidgets((prev) => prev.filter((w) => w.instanceId !== instanceId));
  }, []);

  const moveWidgetMain = useCallback((dragIndex: number, hoverIndex: number) => {
    setCanvasMainWidgets((prev) => {
      const next = [...prev];
      const [removed] = next.splice(dragIndex, 1);
      next.splice(hoverIndex, 0, removed);
      return next;
    });
  }, []);

  const moveWidgetSidebar = useCallback((dragIndex: number, hoverIndex: number) => {
    setCanvasSidebarWidgets((prev) => {
      const next = [...prev];
      const [removed] = next.splice(dragIndex, 1);
      next.splice(hoverIndex, 0, removed);
      return next;
    });
  }, []);

  const toggleWidgetLayoutSize = useCallback((instanceId: string) => {
    const flip = (w: HydratedPlacedWidget) =>
      w.instanceId === instanceId
        ? { ...w, layoutSize: w.layoutSize === 'expanded' ? ('compact' as const) : ('expanded' as const) }
        : w;
    setCanvasMainWidgets((prev) => prev.map(flip));
  }, []);

  const onReportViewChange = useCallback((instanceId: string, reportView: ReportWidgetView) => {
    const patch = (w: HydratedPlacedWidget) =>
      w.instanceId === instanceId ? { ...w, reportView } : w;
    setCanvasMainWidgets((prev) => prev.map(patch));
    setCanvasSidebarWidgets((prev) => prev.map(patch));
  }, []);

  const categories = Array.from(new Set(WIDGET_CATALOG.map((w) => w.category)));

  const save = () => {
    onSaveDashboard({
      title:
        draftDashboardTitle.trim() ||
        (mode === 'edit' ? dashboardTitle : '') ||
        'Untitled dashboard',
      widgets: financePageWidgetsFromHydrated(canvasMainWidgets),
      sidebarWidgets: financeSidebarWidgetsForPersist(financePageWidgetsFromHydrated(canvasSidebarWidgets)),
      mainGridColumns,
      showSidebar: draftShowSidebar,
    });
  };

  return (
    <StrategicDashboardChartsProvider value={chartsValue}>
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            {mode === 'create' ? 'New Finances page' : 'Customize dashboard'}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {mode === 'edit' && (
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmInput('');
                setDeleteDialogOpen(true);
              }}
              className="p-2.5 rounded-[8px] border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
              title="Delete dashboard"
              aria-label="Delete dashboard"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-[8px] text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="px-4 py-2 bg-blue-600 text-white rounded-[8px] text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-600/20"
          >
            <Check className="w-4 h-4" />
            Save layout
          </button>
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteConfirmInput('');
        }}
      >
        <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-[480px] gap-0 p-0 overflow-hidden z-[100]">
          <div className="p-6 pb-4">
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <AlertTriangle className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <DialogTitle className="text-gray-900 text-lg text-left">
                    Delete this dashboard?
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="text-gray-600 text-sm text-left mt-3 space-y-3">
                      <p className="font-medium text-gray-800">If you continue:</p>
                      <ul className="list-disc pl-4 space-y-1.5 text-gray-600">
                        <li>
                          This dashboard is removed for <strong>everyone</strong> at your firm—collaborators and
                          viewers lose access immediately.
                        </li>
                        <li>
                          All widgets, layout, and settings for this page are <strong>permanently erased</strong>{' '}
                          and cannot be restored.
                        </li>
                        <li>
                          Bookmarks and any exports or schedules tied only to this dashboard will{' '}
                          <strong>stop working</strong>.
                        </li>
                      </ul>
                      <p className="text-gray-800 pt-1">
                        To confirm, type the dashboard&apos;s full name <strong>exactly</strong> as shown below
                        (including capitalization).
                      </p>
                      <p className="font-mono text-sm bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-gray-900 break-all">
                        {dashboardTitle || '(empty name)'}
                      </p>
                    </div>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <div className="px-6 pb-4 border-t border-gray-100 pt-4">
            <label htmlFor="delete-dashboard-confirm" className="sr-only">
              Type dashboard name to confirm deletion
            </label>
            <Input
              id="delete-dashboard-confirm"
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              placeholder="Type the full dashboard name"
              autoComplete="off"
              className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <DialogFooter className="flex-row justify-end gap-2 border-t border-gray-100 bg-gray-50/80 px-6 py-4">
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-[8px] hover:bg-gray-50 transition-colors"
            >
              Keep dashboard
            </button>
            <button
              type="button"
              disabled={!deleteNameMatches}
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteConfirmInput('');
                onDeleteDashboard();
              }}
              className="px-4 py-2 text-sm font-medium text-white rounded-[8px] transition-opacity disabled:opacity-40 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700"
            >
              Delete permanently
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mb-4 shrink-0 max-w-xl">
        <Input
          aria-label={mode === 'create' ? 'Name for new page' : 'Dashboard title'}
          value={draftDashboardTitle}
          onChange={(e) => setDraftDashboardTitle(e.target.value)}
          placeholder={
            mode === 'create' ? 'Name shown in sidebar (e.g. Q2 Revenue board)' : 'Dashboard title'
          }
          className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="mb-3 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-[11px] text-gray-500 max-w-3xl">
          {draftShowSidebar ? (
            <>
              Drag from the library into the <strong>main area</strong> (2-column grid) or the <strong>sidebar</strong>.
              Sidebar widgets stay <strong>compact</strong> only.
            </>
          ) : (
            <>
              Right sidebar is off—the <strong>main area</strong> uses the full width. Turn the sidebar back on to
              add a right column.
            </>
          )}
        </p>
        <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer shrink-0 select-none">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={draftShowSidebar}
            onChange={(e) => setDraftShowSidebar(e.target.checked)}
          />
          <span className="font-medium">Show right sidebar</span>
        </label>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div
            className={`flex-1 rounded-2xl border-2 border-dashed p-4 md:p-6 overflow-y-auto custom-scrollbar transition-colors min-h-[320px] bg-gray-100/50 ${
              isOverMain || (draftShowSidebar && isOverSidebar) ? 'border-blue-400 bg-blue-50/25' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <LayoutDashboard className="w-4 h-4 text-gray-400 shrink-0" />
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Page canvas</p>
            </div>

            <div
              className={`flex flex-col gap-6 lg:gap-8 items-start ${draftShowSidebar ? 'lg:flex-row' : ''}`}
            >
              <div
                ref={(node) => mainDropRef(node) as any}
                className={`min-w-0 w-full rounded-xl p-3 -m-3 transition-[box-shadow] min-h-[200px] ${
                  draftShowSidebar ? 'flex-1' : 'flex-1 max-w-none'
                } ${isOverMain ? 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50/40' : ''}`}
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">Main · 2 columns</p>
                {canvasMainWidgets.length === 0 ? (
                  <div className="min-h-[160px] flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white/50">
                    <p className="text-sm font-medium text-gray-600">Main area is empty</p>
                    <p className="text-xs mt-1 text-center max-w-sm text-gray-500 px-4">
                      Drop widgets here. Expand/compact controls full row vs half row on large screens.
                    </p>
                  </div>
                ) : (
                  <div className={mainGridClass(mainGridColumns)}>
                    {canvasMainWidgets.map((widget, index) => (
                      <SortableCanvasWidget
                        key={widget.instanceId}
                        widget={widget}
                        index={index}
                        canvasList="main"
                        canvasDragType={ItemTypes.CANVAS_MAIN}
                        moveWidget={moveWidgetMain}
                        removeWidget={removeWidget}
                        toggleLayoutSize={toggleWidgetLayoutSize}
                        onReportViewChange={onReportViewChange}
                        onTakeAction={onTakeAction}
                        onExploreData={onExploreData}
                        executedBriefingInsightIds={executedBriefingInsightIds}
                        onDigitalTwinScenario={onDigitalTwinScenario}
                        mainGridColumns={mainGridColumns}
                        modellingUi={modellingUi}
                        onFinanceWidgetExplore={onFinanceWidgetExplore}
                      />
                    ))}
                  </div>
                )}
                {isOverMain && canvasMainWidgets.length > 0 && (
                  <div className="mt-4 border-2 border-blue-300 border-dashed rounded-[12px] h-[72px] bg-blue-50/60 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xs flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5" /> Drop into main area
                    </span>
                  </div>
                )}
              </div>

              {draftShowSidebar && (
                <div
                  ref={(node) => sidebarDropRef(node) as any}
                  className={`w-full lg:w-[300px] shrink-0 rounded-xl p-3 -m-3 transition-[box-shadow] lg:max-w-[320px] ${
                    isOverSidebar ? 'ring-2 ring-violet-400 ring-offset-2 bg-violet-50/30' : ''
                  }`}
                >
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">
                    Sidebar · compact only
                  </p>
                  {canvasSidebarWidgets.length === 0 ? (
                    <div className="min-h-[120px] flex flex-col items-center justify-center text-gray-400 text-center px-2 border border-dashed border-gray-200 rounded-xl bg-white/50">
                      <p className="text-sm font-medium text-gray-600">Sidebar empty</p>
                      <p className="text-xs mt-1 text-gray-500">Drop widgets for the right column on the live page.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {canvasSidebarWidgets.map((widget, index) => (
                        <SortableCanvasWidget
                          key={widget.instanceId}
                          widget={widget}
                          index={index}
                          canvasList="sidebar"
                          canvasDragType={ItemTypes.CANVAS_SIDEBAR}
                          moveWidget={moveWidgetSidebar}
                          removeWidget={removeWidget}
                          onReportViewChange={onReportViewChange}
                          onTakeAction={onTakeAction}
                          onExploreData={onExploreData}
                          executedBriefingInsightIds={executedBriefingInsightIds}
                          onDigitalTwinScenario={onDigitalTwinScenario}
                          modellingUi={modellingUi}
                          onFinanceWidgetExplore={onFinanceWidgetExplore}
                        />
                      ))}
                    </div>
                  )}
                  {isOverSidebar && canvasSidebarWidgets.length > 0 && (
                    <div className="mt-4 border-2 border-violet-300 border-dashed rounded-[12px] h-[72px] bg-violet-50/50 flex items-center justify-center">
                      <span className="text-violet-700 font-medium text-xs flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5" /> Drop into sidebar
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-[300px] lg:w-[320px] bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden shrink-0 max-h-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-[14px] font-bold text-gray-900">Widget Library</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6 min-h-0">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">{category}</h3>
                <div className="flex flex-col">
                  {WIDGET_CATALOG.filter((w) => w.category === category).map((widget) => (
                    <LibraryItem key={widget.id} item={widget} />
                  ))}
                </div>
              </div>
            ))}
            {reportLibrary.length > 0 && (
              <div>
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Reports</h3>
                <p className="text-[10px] text-gray-500 mb-2 px-1 leading-relaxed">
                  Drag a report to embed it into the main area or sidebar inside the page canvas.
                </p>
                <div className="flex flex-col">
                  {reportLibrary.map((r) => (
                    <ReportLibraryItem key={r.name} name={r.name} desc={r.desc} icon={r.icon} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-blue-50/30 shrink-0">
            <div className="flex gap-2 text-blue-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Need custom reports? Ask your Firm Intelligence to generate a new widget.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </StrategicDashboardChartsProvider>
  );
};

export const DashboardCustomizer = ({
  onClose,
  onTakeAction,
  onExploreData,
  mode,
  dashboardTitle,
  initialWidgets,
  initialSidebarWidgets,
  initialShowSidebar,
  reportLibrary,
  onSaveDashboard,
  onDeleteDashboard,
  executedBriefingInsightIds,
  onDigitalTwinScenario,
  getCustomizerStrategicRows,
  modellingWidgetModels,
  financialGoalModelIds,
  onModellingExplore,
  onModellingOpenCreateModel,
  initialPeerBenchmarkEnabled,
  onFinanceWidgetExplore,
}: {
  onClose: () => void;
  onTakeAction?: (insightId: string) => void;
  onExploreData?: (insightId: string) => void;
  mode: 'create' | 'edit';
  dashboardTitle: string;
  initialWidgets: FinancePageWidget[];
  initialSidebarWidgets: FinancePageWidget[];
  initialShowSidebar: boolean;
  reportLibrary: readonly ReportLibraryEntry[];
  onSaveDashboard: (payload: FinanceDashboardSavePayload) => void;
  onDeleteDashboard: () => void;
  executedBriefingInsightIds?: readonly BriefingInsightId[];
  onDigitalTwinScenario?: (id: DigitalTwinScenarioId) => void;
  getCustomizerStrategicRows?: (
    previewModelId: string | null,
    peerBenchmarkEnabled: boolean,
    peerPageContext: PeerBenchmarkPageContext | null,
  ) => StrategicMonthRow[];
  modellingWidgetModels: ModellingWidgetUiBridge['models'];
  financialGoalModelIds: readonly string[];
  onModellingExplore: (modelId: string) => void;
  onModellingOpenCreateModel: () => void;
  /** Match live Finances toggle when the customizer opens. */
  initialPeerBenchmarkEnabled?: boolean;
  onFinanceWidgetExplore?: (payload: FinanceWidgetExplorePayload) => void;
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DashboardCustomizerContent
        onClose={onClose}
        onTakeAction={onTakeAction}
        onExploreData={onExploreData}
        mode={mode}
        dashboardTitle={dashboardTitle}
        initialWidgets={initialWidgets}
        initialSidebarWidgets={initialSidebarWidgets}
        initialShowSidebar={initialShowSidebar}
        reportLibrary={reportLibrary}
        onSaveDashboard={onSaveDashboard}
        onDeleteDashboard={onDeleteDashboard}
        executedBriefingInsightIds={executedBriefingInsightIds}
        onDigitalTwinScenario={onDigitalTwinScenario}
        getCustomizerStrategicRows={getCustomizerStrategicRows}
        modellingWidgetModels={modellingWidgetModels}
        financialGoalModelIds={financialGoalModelIds}
        onModellingExplore={onModellingExplore}
        onModellingOpenCreateModel={onModellingOpenCreateModel}
        initialPeerBenchmarkEnabled={initialPeerBenchmarkEnabled}
        onFinanceWidgetExplore={onFinanceWidgetExplore}
      />
    </DndProvider>
  );
};

'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Model, TabNode, IJsonModel, Actions, DockLocation } from 'flexlayout-react';
import { useMarketData } from '@/hooks/useMarketData';
import { useTerminalStore } from '@/hooks/useTerminalStore';
import { StatCardWidget } from './StatCardWidget';
import { AccountBalanceWidget } from './AccountBalanceWidget';
import { RewardRiskWidget } from './RewardRiskWidget';
import { TradeListWidget } from './TradeListWidget';
import { MonthlyStatsWidget } from './MonthlyStatsWidget';
import { ChartWidget } from './ChartWidget';
import { OrderBookWidget } from './OrderBookWidget';
import { WhisperWrapper } from './WhisperWrapper';
import { Activity, Wallet, Target, ListOrdered, Calendar, LineChart, BookOpen } from 'lucide-react';

const initialLayout: IJsonModel = {
  global: {
    tabEnableClose: true,
    tabEnableRename: false,
    tabSetEnableMaximize: true,
    splitterSize: 4,
  },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'column',
        weight: 75,
        children: [
          {
            type: 'row',
            weight: 25,
            children: [
              {
                type: 'tabset',
                weight: 25,
                children: [
                  { type: 'tab', name: 'This Week', component: 'stat_week' }
                ]
              },
              {
                type: 'tabset',
                weight: 25,
                children: [
                  { type: 'tab', name: 'This Month', component: 'stat_month' }
                ]
              },
              {
                type: 'tabset',
                weight: 25,
                children: [
                  { type: 'tab', name: 'This Year', component: 'stat_year' }
                ]
              },
              {
                type: 'tabset',
                weight: 25,
                children: [
                  { type: 'tab', name: 'All Time', component: 'stat_all' }
                ]
              }
            ]
          },
          {
            type: 'row',
            weight: 45,
            children: [
              {
                type: 'tabset',
                weight: 50,
                children: [
                  { type: 'tab', name: 'Account Balance', component: 'account_balance' }
                ]
              },
              {
                type: 'tabset',
                weight: 50,
                children: [
                  { type: 'tab', name: 'Reward:Risk', component: 'reward_risk' }
                ]
              }
            ]
          },
          {
            type: 'tabset',
            weight: 30,
            children: [
              { type: 'tab', name: 'Monthly Stats', component: 'monthly_stats' }
            ]
          }
        ]
      },
      {
        type: 'column',
        weight: 25,
        children: [
          {
            type: 'tabset',
            weight: 50,
            children: [
              { type: 'tab', name: 'Trades', component: 'trade_list' },
              { type: 'tab', name: 'Chart', component: 'chart', config: { symbol: 'BTC/USD' } }
            ]
          },
          {
            type: 'tabset',
            weight: 50,
            children: [
              { type: 'tab', name: 'Order Book', component: 'order_book', config: { symbol: 'BTC/USD' } }
            ]
          }
        ]
      }
    ]
  }
};

export const AVAILABLE_WIDGETS = [
  { name: 'This Week', component: 'stat_week' },
  { name: 'This Month', component: 'stat_month' },
  { name: 'This Year', component: 'stat_year' },
  { name: 'All Time', component: 'stat_all' },
  { name: 'Account Balance', component: 'account_balance' },
  { name: 'Reward:Risk', component: 'reward_risk' },
  { name: 'Trades', component: 'trade_list' },
  { name: 'Monthly Stats', component: 'monthly_stats' },
  { name: 'Chart (BTC/USD)', component: 'chart', config: { symbol: 'BTC/USD' } },
  { name: 'Order Book (BTC/USD)', component: 'order_book', config: { symbol: 'BTC/USD' } },
];

export function TerminalLayout() {
  const [model, setModel] = useState<Model | null>(null);
  const { layoutAction, setLayoutAction } = useTerminalStore();

  // Initialize high-frequency market data source
  useMarketData();

  useEffect(() => {
    // Clear old localStorage to force the new layout with the Monthly Stats widget
    localStorage.removeItem('deeptrade-layout-v2');

    const savedLayout = localStorage.getItem('deeptrade-layout-v3');
    let initModel: Model;
    if (savedLayout) {
      try {
        initModel = Model.fromJson(JSON.parse(savedLayout));
      } catch (e) {
        initModel = Model.fromJson(initialLayout);
      }
    } else {
      initModel = Model.fromJson(initialLayout);
    }

    setTimeout(() => {
      setModel(initModel);
    }, 0);
  }, []);

  useEffect(() => {
    if (layoutAction && model) {
      if (layoutAction.type === 'ADD_WIDGET') {
        model.doAction(Actions.addNode({
          type: 'tab',
          component: layoutAction.widget.component,
          name: layoutAction.widget.name,
          config: layoutAction.widget.config,
        }, model.getRoot().getId(), DockLocation.CENTER, -1));
      } else if (layoutAction.type === 'RESET_LAYOUT') {
        localStorage.removeItem('deeptrade-layout-v3');
        setTimeout(() => setModel(Model.fromJson(initialLayout)), 0);
      }
      setTimeout(() => setLayoutAction(null), 0);
    }
  }, [layoutAction, model, setLayoutAction]);

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = node.getConfig() || {};

    switch (component) {
      case 'stat_week':
        return <WhisperWrapper><StatCardWidget title="This Week" rr={-1.01} percent={-1.04} amount={-188.21} progress={0} counts={[1, 0, 0, 1]} /></WhisperWrapper>;
      case 'stat_month':
        return <WhisperWrapper><StatCardWidget title="This Month" rr={0.52} percent={0.62} amount={101.30} progress={33.33} counts={[3, 1, 0, 2]} /></WhisperWrapper>;
      case 'stat_year':
        return <WhisperWrapper><StatCardWidget title="This Year" rr={17.10} percent={16.98} amount={2736.67} progress={51.28} counts={[43, 20, 4, 19]} /></WhisperWrapper>;
      case 'stat_all':
        return <WhisperWrapper><StatCardWidget title="All Time" rr={59.22} percent={59.02} amount={7832.95} progress={55.68} counts={[100, 49, 12, 39]} /></WhisperWrapper>;
      case 'account_balance':
        return <WhisperWrapper><AccountBalanceWidget /></WhisperWrapper>;
      case 'reward_risk':
        return <WhisperWrapper><RewardRiskWidget /></WhisperWrapper>;
      case 'trade_list':
        return <WhisperWrapper><TradeListWidget /></WhisperWrapper>;
      case 'monthly_stats':
        return <WhisperWrapper><MonthlyStatsWidget /></WhisperWrapper>;
      case 'chart':
        return <ChartWidget />;
      case 'order_book':
        return <OrderBookWidget />;
      default:
        return <div className="p-4 text-muted-foreground">Component not found</div>;
    }
  };

  const onModelChange = (newModel: Model) => {
    localStorage.setItem('deeptrade-layout-v3', JSON.stringify(newModel.toJson()));
  };

  const onRenderTab = (node: TabNode, renderState: any) => {
    const component = node.getComponent();

    let Icon = null;
    switch (component) {
      case 'stat_week':
      case 'stat_month':
      case 'stat_year':
      case 'stat_all':
        Icon = <Activity className="w-4 h-4 mr-2 text-primary/70" />;
        break;
      case 'account_balance':
        Icon = <Wallet className="w-4 h-4 mr-2 text-primary/70" />;
        break;
      case 'reward_risk':
        Icon = <Target className="w-4 h-4 mr-2 text-primary/70" />;
        break;
      case 'trade_list':
        Icon = <ListOrdered className="w-4 h-4 mr-2 text-primary/70" />;
        break;
      case 'monthly_stats':
        Icon = <Calendar className="w-4 h-4 mr-2 text-primary/70" />;
        break;
      case 'chart':
        Icon = <LineChart className="w-4 h-4 mr-2 text-primary/70" />;
        break;
      case 'order_book':
        Icon = <BookOpen className="w-4 h-4 mr-2 text-primary/70" />;
        break;
    }

    if (Icon) {
      renderState.leading = Icon;
    }
  };

  if (!model) return <div className="h-full w-full bg-background flex items-center justify-center text-muted-foreground">Initializing Terminal...</div>;

  return (
    <div className="h-full w-full relative bg-[#0B0E11]">
      <div className="relative z-10 h-full w-full">
        <Layout model={model} factory={factory} onModelChange={onModelChange} onRenderTab={onRenderTab} />
      </div>
    </div>
  );
}

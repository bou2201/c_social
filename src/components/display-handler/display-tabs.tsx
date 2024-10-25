'use client';

import { ReactNode, useCallback, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type TabProps = {
  value: string;
  name: string;
  component: ReactNode;
};

export type DisplayTabsProps = {
  tabs: TabProps[];
  className?: string;
  notRedirect?: boolean;
  block?: boolean;
};

export const DisplayTabs = ({ tabs, className, notRedirect, block }: DisplayTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = useSearchParams().get('tab');

  const [value, setValue] = useState<string>(currentTab ?? tabs[0].value);

  const handleChangeTab = useCallback(
    (value: string) => {
      setValue(value);
      if (!notRedirect) {
        router.push(`${pathname}?tab=${value}`);
      }
    },
    [notRedirect, pathname, router],
  );

  return (
    <Tabs defaultValue={value} className={className}>
      <TabsList
        style={
          block
            ? {
                gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
                width: '100%',
                display: 'grid',
              }
            : {}
        }
      >
        {tabs.map((tab) => (
          <TabsTrigger
            value={tab.value}
            key={tab.value}
            onClick={(e) => {
              e.preventDefault();
              handleChangeTab(tab.value);
            }}
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent value={tab.value} key={tab.value}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

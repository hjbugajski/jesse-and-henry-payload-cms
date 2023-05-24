import 'ag-grid-community/styles/ag-grid-no-native-widgets.css';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  CellEditingStoppedEvent,
  ColDef,
  GetRowIdParams,
  ICellRendererParams,
  RowDragEndEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Pill } from 'payload/components';
import { Eyebrow } from 'payload/components/elements';
import { useConfig } from 'payload/components/utilities';
import { Link } from 'react-router-dom';

import SelectEditor from './SelectEditor';
import Tag from './Tag';
import { Guest, Party } from '../../payload-types';
import { PayloadGetApi, PayloadPostApi } from '../types/api';

import './GuestList.scss';

const GuestList: React.FC = (props: any) => {
  const {
    collection: { fields },
    data: { docs },
  } = props;

  // Refs
  const gridRef = useRef<AgGridReact<Guest>>(null);

  // State
  const [error, setError] = useState<string | null>(null);
  const [rowData, setRowData] = useState<Guest[]>([]);

  // Hooks
  const { serverURL } = useConfig();

  // Callbacks
  const addGuest = useCallback(async () => {
    const res = await fetch(serverURL + '/api/guests', {
      method: 'POST',
      credentials: 'include',
    });

    if (res.status !== 200) {
      setError(res.statusText);

      return;
    }

    const data: PayloadPostApi<Guest> = await res.json();

    setRowData([data.doc, ...rowData]);
  }, [rowData, serverURL]);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch(serverURL + '/api/guests?limit=250', {
        credentials: 'include',
      });

      if (res.status !== 200) {
        setError(res.statusText);

        return;
      }

      const data: PayloadGetApi<Guest> = await res.json();

      setRowData([...data.docs]);
    } catch (error) {
      console.error(error);
    }
  }, [serverURL]);

  const getRowId = useCallback((params: GetRowIdParams<Guest>) => params.data.id, []);

  const getRsvpColumnDefs = useCallback(
    (fieldName: string): Partial<ColDef<Guest>> => ({
      cellRenderer: (params: ICellRendererParams<Guest, any>) =>
        params.value ? (
          <Tag
            value={params.value === 'accept' ? 'Accepted' : 'Declined'}
            color={params.value === 'accept' ? 'green' : 'red'}
          />
        ) : null,
      cellEditor: SelectEditor,
      cellEditorPopup: true,
      cellEditorPopupPosition: 'over',
      cellEditorParams: {
        getLabel: (v: any) => v.label,
        getValue: (v: any) => v.value,
        isClearable: fields.find((f: any) => f.name === fieldName)?.admin.isClearable ?? false,
        options: fields.find((f: any) => f.name === fieldName)?.options ?? [],
      },
    }),
    [fields]
  );

  const getTagsColumnDefs = useCallback(
    (collection: string): Partial<ColDef<Guest>> => ({
      cellRenderer: (params: ICellRendererParams<Guest, Party>) =>
        params.value?.value ? <Tag value={params.value?.value} color={params.value?.color} /> : null,
      cellEditor: SelectEditor,
      cellEditorPopup: true,
      cellEditorPopupPosition: 'over',
      cellEditorParams: {
        collection: collection,
        getLabel: (v: Party) => v.value,
        getValue: (v: Party) => v.id,
        isClearable: true,
      },
    }),
    []
  );

  const onCellEditingStopped = useCallback(
    async (params: CellEditingStoppedEvent<Guest>) => {
      if (!params.valueChanged) {
        return;
      }

      try {
        const field: keyof Guest = params.colDef.field as keyof Guest;
        const value = params.newValue?.id
          ? params.newValue.id
          : params.newValue?.value
          ? params.newValue.value
          : params.newValue ?? null;

        const res = await fetch(serverURL + `/api/guests/${params.data.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [field]: value,
          }),
        });

        if (res.status !== 200) {
          setError(res.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [serverURL]
  );

  const onRowDragEnd = useCallback(
    async (e: RowDragEndEvent<Guest>) => {
      const guests: Guest[] = [];

      e.api.forEachNode((node) => {
        if (node.data) {
          guests.push(node.data);
        }
      });

      for (let i = 0; i < guests.length; i++) {
        const guest = guests[i];

        if (guest.sort === i) {
          continue;
        }

        try {
          const res = await fetch(serverURL + `/api/guests/${guest.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sort: i,
            }),
          });

          if (res.status !== 200) {
            setError(res.statusText);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    [serverURL]
  );

  // Memoized
  const columnDefs: ColDef<Guest>[] = useMemo(
    () => [
      {
        editable: false,
        minWidth: 31,
        pinned: 'left',
        resizable: false,
        rowDrag: true,
        singleClickEdit: false,
        width: 31,
      },
      {
        field: 'first',
        initialWidth: 125,
        pinned: 'left',
        singleClickEdit: false,
        cellRenderer: (params: ICellRendererParams<Guest, string>) => (
          <Link to={`/admin/collections/guests/${params.data.id}`}>{params.value ?? '<No First Name>'}</Link>
        ),
      },
      {
        field: 'last',
        initialWidth: 150,
      },
      {
        field: 'party',
        cellClass: 'ag-cell--no-padding',
        initialWidth: 175,
        ...getTagsColumnDefs('parties'),
      },
      {
        field: 'side',
        initialWidth: 75,
        minWidth: 75,
        ...getTagsColumnDefs('sides'),
      },
      {
        field: 'relation',
        initialWidth: 150,
        minWidth: 120,
        ...getTagsColumnDefs('relations'),
      },
      {
        field: 'email',
        cellClass: (params) => (params.value.includes('@jesseandhenry.com') ? 'text--low-contrast' : undefined),
      },
      {
        field: 'phone',
        initialWidth: 150,
      },
      {
        field: 'address',
      },
      {
        field: 'rsvpWelcomeParty',
        headerName: 'RSVP Welcome Party',
        ...getRsvpColumnDefs('rsvpWelcomeParty'),
      },
      {
        field: 'rsvpWedding',
        headerName: 'RSVP Wedding',
        ...getRsvpColumnDefs('rsvpWedding'),
      },
      {
        field: 'rsvpBrunch',
        headerName: 'RSVP Brunch',
        cellClass: (params) => (params.node.rowPinned ? undefined : 'ag-cell--last'),
        headerClass: 'ag-header-cell--last',
        ...getRsvpColumnDefs('rsvpBrunch'),
      },
    ],
    [getRsvpColumnDefs, getTagsColumnDefs]
  );

  const defaultColDef: ColDef<Guest> = useMemo(
    () => ({
      editable: true,
      minWidth: 120,
      resizable: true,
      singleClickEdit: true,
    }),
    []
  );

  const icons = useMemo(
    () => ({
      columnMoveMove:
        '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor" class="text--low-contrast"><path d="M480-81.413 304.348-257.065 363-315.717l75.5 75.499V-438.5H240.218l75.499 75.5-58.652 58.652L81.413-480l175.652-175.652L315.717-597l-75.499 75.5H438.5v-198.282L363-644.283l-58.652-58.652L480-878.587l175.652 175.652L597-644.283l-75.5-75.499V-521.5h198.282L644.283-597l58.652-58.652L878.587-480 702.935-304.348 644.283-363l75.499-75.5H521.5v198.282l75.5-75.499 58.652 58.652L480-81.413Z"/></svg>',
      rowDrag:
        '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor" class="text--low-contrast"><path d="M349.911-160Q321-160 300.5-180.589q-20.5-20.588-20.5-49.5Q280-259 300.589-279.5q20.588-20.5 49.5-20.5Q379-300 399.5-279.411q20.5 20.588 20.5 49.5Q420-201 399.411-180.5q-20.588 20.5-49.5 20.5Zm260 0Q581-160 560.5-180.589q-20.5-20.588-20.5-49.5Q540-259 560.589-279.5q20.588-20.5 49.5-20.5Q639-300 659.5-279.411q20.5 20.588 20.5 49.5Q680-201 659.411-180.5q-20.588 20.5-49.5 20.5Zm-260-250Q321-410 300.5-430.589q-20.5-20.588-20.5-49.5Q280-509 300.589-529.5q20.588-20.5 49.5-20.5Q379-550 399.5-529.411q20.5 20.588 20.5 49.5Q420-451 399.411-430.5q-20.588 20.5-49.5 20.5Zm260 0Q581-410 560.5-430.589q-20.5-20.588-20.5-49.5Q540-509 560.589-529.5q20.588-20.5 49.5-20.5Q639-550 659.5-529.411q20.5 20.588 20.5 49.5Q680-451 659.411-430.5q-20.588 20.5-49.5 20.5Zm-260-250Q321-660 300.5-680.589q-20.5-20.588-20.5-49.5Q280-759 300.589-779.5q20.588-20.5 49.5-20.5Q379-800 399.5-779.411q20.5 20.588 20.5 49.5Q420-701 399.411-680.5q-20.588 20.5-49.5 20.5Zm260 0Q581-660 560.5-680.589q-20.5-20.588-20.5-49.5Q540-759 560.589-779.5q20.588-20.5 49.5-20.5Q639-800 659.5-779.411q20.5 20.588 20.5 49.5Q680-701 659.411-680.5q-20.588 20.5-49.5 20.5Z"/></svg>',
    }),
    []
  );

  useEffect(() => {
    fetchDocs();
  }, [docs, fetchDocs]);

  return (
    <div className="default-page-template">
      <Eyebrow />
      <div className="gutter--left gutter--right collection-list__wrap component">
        <div className="row">
          <h1>Guests</h1>
          <Pill onClick={addGuest} className="pill margin--bottom">
            Create New
          </Pill>
        </div>
        {error && <p>{error}</p>}
        <AgGridReact
          ref={gridRef}
          animateRows={true}
          className="guest-data-grid"
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          headerHeight={32}
          icons={icons}
          onCellEditingStopped={onCellEditingStopped}
          onRowDragEnd={onRowDragEnd}
          rowData={rowData}
          rowDragManaged={true}
          rowDragMultiRow={true}
          rowHeight={36}
          rowSelection={'multiple'}
          stopEditingWhenCellsLoseFocus={true}
          suppressMovableColumns={true}
          suppressRowClickSelection={false}
          suppressColumnVirtualisation={true}
        />
      </div>
    </div>
  );
};

export default GuestList;

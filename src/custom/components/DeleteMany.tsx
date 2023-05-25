/**
 * Modified version of the DeleteMany component from Payload
 * https://github.com/payloadcms/payload/blob/master/src/admin/components/elements/DeleteMany/index.tsx
 */
import React, { useCallback, useState } from 'react';

import { Modal, useModal } from '@faceless-ui/modal';
import { Button, MinimalTemplate, Pill } from 'payload/components';
import { useAuth, useConfig } from 'payload/components/utilities';
import { getTranslation } from 'payload/dist/utilities/getTranslation';
import { SanitizedCollectionConfig } from 'payload/types';
import { useTranslation } from 'react-i18next';

const baseClass = 'delete-documents';

type Props = {
  collection: SanitizedCollectionConfig;
  count: number;
  queryParams: string;
  onDelete: () => void;
};

const DeleteMany: React.FC<Props> = (props) => {
  const { count, queryParams, onDelete, collection: { slug, labels: { plural } } = {} } = props;

  const { permissions } = useAuth();
  const {
    serverURL,
    routes: { api },
  } = useConfig();
  const { toggleModal } = useModal();
  const { t, i18n } = useTranslation('general');
  const [deleting, setDeleting] = useState(false);

  const collectionPermissions = permissions?.collections?.[slug];
  const hasDeletePermission = collectionPermissions?.delete?.permission;

  const modalSlug = `delete-${slug}`;

  const handleDelete = useCallback(async () => {
    setDeleting(true);

    try {
      const res = await fetch(`${serverURL}${api}/${slug}?${queryParams}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status !== 200) {
        console.error(res);
        return;
      }

      onDelete();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
      toggleModal(modalSlug);
    }
  }, [api, onDelete, queryParams, serverURL, slug, toggleModal]);

  if (!hasDeletePermission) {
    return null;
  }

  return (
    <React.Fragment>
      <Pill
        className={`${baseClass}__toggle margin--bottom`}
        onClick={() => {
          setDeleting(false);
          toggleModal(modalSlug);
        }}
      >
        {t('delete')}
      </Pill>
      <Modal slug={modalSlug} className={baseClass}>
        <MinimalTemplate className={`${baseClass}__template`}>
          <h1>{t('confirmDeletion')}</h1>
          <p>{t('aboutToDeleteCount', { label: getTranslation(plural, i18n), count })}</p>
          <Button
            id="confirm-cancel"
            buttonStyle="secondary"
            type="button"
            onClick={deleting ? undefined : () => toggleModal(modalSlug)}
          >
            {t('cancel')}
          </Button>
          <Button onClick={deleting ? undefined : handleDelete} id="confirm-delete">
            {deleting ? t('deleting') : t('confirm')}
          </Button>
        </MinimalTemplate>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteMany;

/**
 * Modified version of the EditMany component from Payload
 * https://github.com/payloadcms/payload/blob/master/src/admin/components/elements/EditMany/index.tsx
 */
import React, { useCallback, useState } from 'react';

import { useModal } from '@faceless-ui/modal';
import { X } from 'payload/components';
import { useAuth, useConfig } from 'payload/components/utilities';
import { Drawer, DrawerToggler } from 'payload/dist/admin/components/elements/Drawer';
import { FieldSelect } from 'payload/dist/admin/components/elements/FieldSelect';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import Form from 'payload/dist/admin/components/forms/Form';
import { useForm } from 'payload/dist/admin/components/forms/Form/context';
import RenderFields from 'payload/dist/admin/components/forms/RenderFields';
import FormSubmit from 'payload/dist/admin/components/forms/Submit';
import { OperationContext } from 'payload/dist/admin/components/utilities/OperationProvider';
import { getTranslation } from 'payload/dist/utilities/getTranslation';
import { SanitizedCollectionConfig } from 'payload/types';
import { useTranslation } from 'react-i18next';

import { PayloadFormOnSuccess } from '../types/api';

type Props = {
  collection: SanitizedCollectionConfig;
  count: number;
  queryParams: string;
  onSuccess: (json: PayloadFormOnSuccess) => void;
};

const baseClass = 'edit-many';

const Submit: React.FC<{ disabled: boolean; action: string }> = ({ action, disabled }) => {
  const { submit } = useForm();
  const { t } = useTranslation('general');

  const save = useCallback(() => {
    submit({
      skipValidation: true,
      method: 'PATCH',
      action,
    });
  }, [action, submit]);

  return (
    <FormSubmit className={`${baseClass}__save`} onClick={save} disabled={disabled}>
      {t('save')}
    </FormSubmit>
  );
};

const Publish: React.FC<{ disabled: boolean; action: string }> = ({ action, disabled }) => {
  const { submit } = useForm();
  const { t } = useTranslation('version');

  const save = useCallback(() => {
    submit({
      skipValidation: true,
      method: 'PATCH',
      overrides: {
        _status: 'published',
      },
      action,
    });
  }, [action, submit]);

  return (
    <FormSubmit className={`${baseClass}__publish`} onClick={save} disabled={disabled}>
      {t('publishChanges')}
    </FormSubmit>
  );
};

const SaveDraft: React.FC<{ disabled: boolean; action: string }> = ({ action, disabled }) => {
  const { submit } = useForm();
  const { t } = useTranslation('version');

  const save = useCallback(() => {
    submit({
      skipValidation: true,
      method: 'PATCH',
      overrides: {
        _status: 'draft',
      },
      action,
    });
  }, [action, submit]);

  return (
    <FormSubmit className={`${baseClass}__draft`} onClick={save} disabled={disabled}>
      {t('saveDraft')}
    </FormSubmit>
  );
};

const EditMany: React.FC<Props> = (props) => {
  const { count, queryParams, onSuccess, collection, collection: { slug, labels: { plural }, fields } = {} } = props;

  const [selected, setSelected] = useState([]);

  const { permissions } = useAuth();
  const { closeModal } = useModal();
  const {
    serverURL,
    routes: { api },
  } = useConfig();
  const { t, i18n } = useTranslation('general');

  const collectionPermissions = permissions?.collections?.[slug];
  const hasUpdatePermission = collectionPermissions?.update?.permission;

  const drawerSlug = `edit-${slug}`;

  const internalOnSuccess = useCallback(
    (json: any) => {
      onSuccess(json);
      closeModal(drawerSlug);
    },
    [onSuccess, closeModal, drawerSlug]
  );

  if (!hasUpdatePermission) {
    return null;
  }

  return (
    <div className={baseClass}>
      <DrawerToggler
        slug={drawerSlug}
        className={`${baseClass}__toggle margin--bottom`}
        aria-label={t('edit')}
        onClick={() => {
          setSelected([]);
        }}
      >
        {t('edit')}
      </DrawerToggler>
      <Drawer slug={drawerSlug} header={null}>
        <OperationContext.Provider value="update">
          <Form className={`${baseClass}__form`} onSuccess={internalOnSuccess}>
            <div className={`${baseClass}__main`}>
              <div className={`${baseClass}__header`}>
                <h2 className={`${baseClass}__header__title`}>
                  {t('editingLabel', { label: getTranslation(plural, i18n), count })}
                </h2>
                <button
                  className={`${baseClass}__header__close`}
                  id={`close-drawer__${drawerSlug}`}
                  type="button"
                  onClick={() => closeModal(drawerSlug)}
                  aria-label={t('close')}
                >
                  <X />
                </button>
              </div>
              <FieldSelect fields={fields} setSelected={setSelected} />
              <RenderFields fieldTypes={fieldTypes} fieldSchema={selected} />
              <div className={`${baseClass}__sidebar-wrap`}>
                <div className={`${baseClass}__sidebar`}>
                  <div className={`${baseClass}__sidebar-sticky-wrap`}>
                    <div className={`${baseClass}__document-actions`}>
                      <Submit action={`${serverURL}${api}/${slug}?${queryParams}`} disabled={selected.length === 0} />
                      {collection.versions && (
                        <React.Fragment>
                          <Publish
                            action={`${serverURL}${api}/${slug}?${queryParams}`}
                            disabled={selected.length === 0}
                          />
                          <SaveDraft
                            action={`${serverURL}${api}/${slug}?${queryParams}`}
                            disabled={selected.length === 0}
                          />
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </OperationContext.Provider>
      </Drawer>
    </div>
  );
};

export default EditMany;

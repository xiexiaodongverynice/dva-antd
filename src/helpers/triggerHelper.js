export const template = `
import com.forceclouds.context.IContext
import com.forceclouds.context.exception.DataRecordOperationException
import com.forceclouds.crm.data.model.DataRecord
import com.forceclouds.crm.data.model.IDataRecord
import com.forceclouds.crm.data.service.IDataRecordService
import com.forceclouds.crm.metadata.model.IObjectDescribe
import com.forceclouds.crm.metadata.model.pgimpl.ObjectDescribe
import com.forceclouds.crm.metadata.service.IObjectDescribeService
import com.forceclouds.crm.trigger.AbstractTrigger
import groovy.json.JsonOutput

/**
 * Created by xx@xx.com
 */
class TestTrigger extends AbstractTrigger{

    @Override
    void beforeCreate(IContext context, IObjectDescribe objectDescribe, IDataRecord record) {
        super.beforeCreate(context, objectDescribe, record)
        println "beforeCreateTrigger"
    }

    @Override
    void afterCreate(IContext context, IObjectDescribe objectDescribe, IDataRecord record, Object o) {
        super.afterCreate(context, objectDescribe, record, o)
        println "afterCreate"
    }

    @Override
    void beforeUpdate(IContext context, IObjectDescribe objectDescribe, IDataRecord newValue) {
        super.beforeUpdate(context, objectDescribe, newValue)
        println "beforeUpdate"
    }

    @Override
    void afterUpdate(IContext context, IObjectDescribe objectDescribe, IDataRecord newValue, Object o) {
        super.afterUpdate(context, objectDescribe, newValue, o)
        println "afterUpdate"
    }

    @Override
    void beforeDelete(IContext context, IObjectDescribe objectDescribe, Long id) {
        super.beforeDelete(context, objectDescribe, id)
        println "beforeDelete"
    }

    @Override
    void afterDelete(IContext context, IObjectDescribe objectDescribe, Long id) {
        super.afterDelete(context, objectDescribe, id)
        println "afterDelete"
    }
}
`;

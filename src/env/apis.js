import vue from 'vue';
import config from './config'
var requestUrl = config.isDevEnv?config.devUrl:config.onlineUrl

const apis = {
    baseUrl: requestUrl,
    loginF: requestUrl + '/cms/login/login',
    isLogin: requestUrl + '/cms/login/isLogin',
    tologout: requestUrl + '/cms/login/loginOut',
    getUserListFS: requestUrl+'/cms/user/list',
    addUser: requestUrl+'/cms/user/add',
    deleteUser: requestUrl+'/cms/user/delete',
    updateUser: requestUrl+'/cms/user/update',
    getMenuListFS: requestUrl + '/cms/menu/list',
    getGoodListFS: requestUrl + '/cms/goods/list',
    addGoods: requestUrl + '/cms/goods/add',
    deleteGoods: requestUrl + '/cms/goods/delete',
    updateGoods: requestUrl + '/cms/goods/update',
    getOrderListFS: requestUrl+'/cms/order/orderList/',
    updateOrderStatus: requestUrl + '/cms/order/updateOrder/',
    getOrderDetail: requestUrl + '/cms/order/findOrderDetail',
    toPrintingOrder: requestUrl + '/cms/order/orderPrint',
    toPrintingDesc: requestUrl + '/cms/order/orderItemPrint',
    getShopListFS: requestUrl+'/cms/store/list',
    getSKUTypeList: requestUrl+'/cms/skuType/list',
    getSKUDesList: requestUrl+'/cms/skuDetail/list',
    getActivityListFS: requestUrl+'/cms/activity/list',
    addActivity: requestUrl+'/cms/activity/add',
    updateActivity: requestUrl+'/cms/activity/update',
    deleteActivity: requestUrl+'/cms/activity/delete',
    getCouponsListByActivityFS: requestUrl+'/cms/activity/couponsList',
    addActivityCoupons: requestUrl+'/cms/activity/addCoupons',
    deleteActivityCoupons: requestUrl+'/cms/activity/deleteCoupons',
    getCategoryListFS: requestUrl+'/cms/category/list',
    getHomeRotationFS: requestUrl+'/cms/carousel/list',
    addHomeRotatio: requestUrl+'/cms/carousel/add',
    deleteHomeRotation: requestUrl+'/cms/carousel/delete',
    getCouponFS: requestUrl+'/cms/coupons/list',
    addCoupon: requestUrl + '/cms/coupons/add',
    deleteCoupon: requestUrl + '/cms/coupons/delete',
    updateCoupon: requestUrl+'/cms/coupons/update',
    getShopStorageListFS: requestUrl + '/cms/inventory/list',
    initStorage: requestUrl + '/cms/inventory/init',
    deleteStorage: requestUrl + '/cms/inventory/delete',
    addStorage: requestUrl + '/cms/inventory/add',
    updateStorage: requestUrl + '/cms/inventory/update',
    clearStorage: requestUrl + '/cms/inventory/clear',
    getPrinterListFS: requestUrl + '/cms/printer/list',
    addPrinter: requestUrl + '/cms/printer/add',
    deletePrinter: requestUrl + '/cms/printer/delete',
    updatePrinter: requestUrl + '/cms/printer/update',
    getUserList: requestUrl + '/cms/user/apiUser/list',
    bandUserToCompany: requestUrl + '/cms/user/apiUser/bindCompany',
    getCompanyList: requestUrl + '/cms/company/list',
    addCompany: requestUrl + '/cms/company/add',
    toDeleteCompany: requestUrl + '/cms/company/delete',
    getExperienceList: requestUrl + '/cms/coupons/experienceList',
    updateExperience: requestUrl + '/cms/coupons/updateExperience',
    turnoverStatistical: requestUrl + '/cms/order/turnoverStatistical',
    orderStatistical: requestUrl + '/cms/order/orderStatistical',
    getRecommendGoods: requestUrl + '/cms/recommend/list',
    addRecommendGoods: requestUrl + '/cms/recommend/add',
    deleteRecommendGoods: requestUrl + '/cms/recommend/delete'

}

const mixinObj = {
    data () {
        return {
            apis,
        }
    }
}

vue.mixin( mixinObj );

export default apis;
